// src/modules/fide/fide.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LichessFideProviderAdapter } from 'src/integration/LichessFideProviderAdapter';
import { FIDE_PROVIDER } from 'src/integration/interface/IFideProvider';

@Module({
  imports: [HttpModule],
  providers: [
    LichessFideProviderAdapter,
    {
      provide: FIDE_PROVIDER,
      useExisting: LichessFideProviderAdapter,
    },
  ],
  exports: [FIDE_PROVIDER, LichessFideProviderAdapter],
})
export class FideModule {}
