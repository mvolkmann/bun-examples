import type {Config} from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'sqlite',
  dbCredentials: {
    url: './todo.db'
  }
} satisfies Config;
