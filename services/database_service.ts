import { Client } from "jsr:@db/postgres";

let client: Client | null = null;

export async function get_client() {
  if (!client) {
    console.log("📡 Connecting to database at:", Deno.env.get("DATABASE_IP"));

    client = new Client({
      user: Deno.env.get("DATABASE_USER"),
      password: Deno.env.get("DATABASE_PASSWORD"),
      database: "yelp",
      hostname: Deno.env.get("DATABASE_IP"),
      port: 5432,
    });
    console.log(client);

    try {
      await client.connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      client = null; // Reset so we can try again
      throw error;
    }
  }
  return client;
}
