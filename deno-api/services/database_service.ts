import { Client } from "@db/postgres";
import { Logger } from "@deno-library/logger";

const logger = new Logger();
let client: Client | null = null;

export async function get_client(): Promise<Client | null> {
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
    } catch (error) {
      logger.error(error);
      client = null;
    }
  }
  return client;
}
