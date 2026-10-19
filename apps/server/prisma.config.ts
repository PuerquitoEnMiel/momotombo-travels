import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
    // Shadow DB used by `prisma migrate diff/dev` only. Optional so that
    // `migrate deploy`/`generate` work with just DATABASE_URL.
    ...(process.env.SHADOW_DATABASE_URL
      ? { shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL }
      : {}),
  },
  migrations: {
    seed: 'npx ts-node prisma/seed/index.ts',
  },
});
