import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from '@shared/schema';

// Create postgres client for Node.js environment
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

// Create database connection with schema
export const db = drizzle(client, { schema });