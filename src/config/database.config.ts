import { registerAs } from '@nestjs/config';
import * as convict from 'convict';

export const databaseConfig = registerAs('database', () => {
  return convict({
    type: {
      doc: 'Database DBMS',
      format: String,
      default: null,
      env: 'DB_TYPE',
    },
    host: {
      doc: 'Database host',
      format: String,
      default: null,
      env: 'DB_HOST',
    },
    port: {
      doc: 'Database port',
      format: Number,
      default: null,
      env: 'DB_PORT',
    },
    username: {
      doc: 'Database user name',
      format: String,
      default: null,
      env: 'DB_USERNAME',
    },
    password: {
      doc: 'Database user password',
      format: String,
      default: null,
      env: 'DB_PASSWORD',
    },
    database: {
      doc: 'Database name',
      format: String,
      default: null,
      env: 'DB_NAME',
    },
    synchronize: {
      doc: 'TypeORM synchronize option',
      format: Boolean,
      default: null,
      env: 'DB_SYNCHRONIZE',
    },
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    options: {
      useUTC: true,
    },
  })
    .validate()
    .getProperties();
});
