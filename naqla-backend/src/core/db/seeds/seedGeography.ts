import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient, Prisma } from '../../../../generated/prisma';

export async function seedGeography(prisma: PrismaClient, enLangId: string, arLangId: string) {
  const parseCSV = (filePath: string) => {
    return new Promise<any[]>((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(path.join(__dirname, filePath))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  };

  console.log('📌 Seeding regions...');
  const regions = await parseCSV('regions.csv');
  await prisma.region.upsert({
    where: { id: 999 },
    update: {},
    create: { id: 999, name: 'Unknown', wikiDataId: null },
  });
  for (const r of regions) {
    await prisma.region.upsert({
      where: { id: parseInt(r.id) },
      update: { name: r.name, wikiDataId: r.wikiDataId || null },
      create: { id: parseInt(r.id), name: r.name, wikiDataId: r.wikiDataId || null },
    });
  }

  console.log('📌 Seeding subregions...');
  const subregions = await parseCSV('subregions.csv');
  for (const s of subregions) {
    await prisma.subRegion.upsert({
      where: { id: parseInt(s.id) },
      update: { name: s.name, regionId: s.region_id ? parseInt(s.region_id) : 999, wikiDataId: s.wikiDataId || null },
      create: { id: parseInt(s.id), name: s.name, regionId: s.region_id ? parseInt(s.region_id) : 999, wikiDataId: s.wikiDataId || null },
    });
  }

  console.log('📌 Seeding countries...');
  const countries = await parseCSV('countries.csv');
  for (const c of countries) {
    let tz = null;
    try { tz = c.timezones ? JSON.parse(c.timezones.replace(/'/g, '"').replace(/([a-zA-Z0-9_]+):/g, '"$1":')) : null; } catch(e) {}
    await prisma.country.upsert({
      where: { id: parseInt(c.id) },
      update: {},
      create: {
        id: parseInt(c.id),
        name: c.name,
        iso3: c.iso3,
        iso2: c.iso2,
        numericCode: c.numeric_code,
        phoneCode: c.phonecode,
        capital: c.capital || null,
        currency: c.currency || 'USD',
        currencyName: c.currency_name || 'US Dollar',
        tld: c.tld || '',
        native: c.native || c.name,
        population: parseInt(c.population) || 0,
        gdp: c.gdp ? parseFloat(c.gdp) : null,
        regionId: c.region_id ? parseInt(c.region_id) : 999,
        subregionId: c.subregion_id ? parseInt(c.subregion_id) : null,
        nationality: c.nationality || c.name,
        areaSqKm: c.area_sq_km ? parseFloat(c.area_sq_km) : 0,
        postalCodeRegex: c.postal_code_regex || null,
        timezone: tz || [],
        emoji: c.emoji || null,
        latitude: c.latitude ? parseFloat(c.latitude) : null,
        longitude: c.longitude ? parseFloat(c.longitude) : null,
        translations: {
          create: [
            { languageId: enLangId, name: c.name, nativeName: c.name },
            { languageId: arLangId, name: c.native && /[\u0600-\u06FF]/.test(c.native) ? c.native : c.name + ' (AR)', nativeName: c.native || c.name }
          ]
        }
      },
    });
  }

  console.log('📌 Seeding states...');
  const states = await parseCSV('states.csv');
  for (const s of states) {
    await prisma.city.upsert({
      where: { id: parseInt(s.id) },
      update: {},
      create: {
        id: parseInt(s.id),
        name: s.name,
        countryId: s.country_id ? parseInt(s.country_id) : 1,
        countryName: s.country_name || null,
        iso2: s.iso2 || '',
        iso3166_2: s.iso3166_2 || null,
        fipsCode: s.fips_code || null,
        type: s.type || null,
        level: s.level ? parseInt(s.level) : 1,
        parentId: null, // We'll update this in the second pass
        native: s.native || null,
        latitude: s.latitude ? parseFloat(s.latitude) : null,
        longitude: s.longitude ? parseFloat(s.longitude) : null,
        timezone: s.timezone ? { name: s.timezone } : Prisma.JsonNull,
        wikiDataId: s.wikiDataId || null,
        population: s.population ? parseInt(s.population) : 0,
        translations: {
          create: [
            { languageId: enLangId, name: s.name },
            { languageId: arLangId, name: s.native && /[\u0600-\u06FF]/.test(s.native) ? s.native : s.name + ' (AR)' }
          ]
        }
      },
    });
  }

  console.log('📌 Updating state hierarchies (second pass)...');
  for (const s of states) {
    if (s.parent_id) {
      await prisma.city.update({
        where: { id: parseInt(s.id) },
        data: { parentId: parseInt(s.parent_id) }
      }).catch(e => {
        console.warn(`Could not set parent ${s.parent_id} for state ${s.id}`);
      });
    }
  }
}
