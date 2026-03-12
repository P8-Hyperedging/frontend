import { Client } from "@db/postgres";

let client: Client | null = null;

export async function get_client() {
  if (!client) {
    client = new Client({
      user: Deno.env.get("DATABASE_USER"),
      password: Deno.env.get("DATABASE_PASSWORD"),
      database: "yelp",
      hostname: Deno.env.get("DATABASE_IP"),
      port: 5432,
    });

    try {
      await client.connect();
      // Database connected successfully
    } catch (error) {
      //Database connection failed
      client = null; // Reset so we can try again
      throw error;
    }
  }
  return client;
}
