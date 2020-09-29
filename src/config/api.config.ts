import { registerAs } from '@nestjs/config';
import * as convict from 'convict';

export const apiConfig = registerAs('api', () => {
  return convict({
    env: {
      doc: 'Server environment',
      format: ['development', 'production', 'test'],
      default: null,
      env: 'NODE_ENV',
    },
    port: {
      doc: 'Port to listen',
      format: Number,
      default: null,
      env: 'PORT',
    },
    allowedCorsOrigin: {
      doc: 'Front-end origin, for which we allow CORS requests',
      format: String,
      default: null,
      env: 'CORS_ALLOWED_ORIGIN',
    }
  })
    .validate()
    .getProperties();
});
