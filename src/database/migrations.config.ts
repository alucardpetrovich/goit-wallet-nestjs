import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '../../.env') });
import { databaseConfig } from '../config/database.config';

const {
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize,
  entities,
  options,
  ssl,
} = databaseConfig();

const cli = {
  migrationsDir: 'src/database/migrations',
};
const migrations = ['src/database/migrations/*{.ts,.js}'];

export {
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize,
  entities,
  migrations,
  options,
  cli,
  ssl,
};
