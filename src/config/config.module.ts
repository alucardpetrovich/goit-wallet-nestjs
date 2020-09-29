import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { encryptConfig } from './encrypt.config';
import { apiConfig } from './api.config';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig, encryptConfig, apiConfig],
});
