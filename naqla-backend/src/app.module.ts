// src/app.module.ts

import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DbModule } from './core/db/db.module';

@Module({
  imports: [DbModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}