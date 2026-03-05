import { Client } from "jsr:@db/postgres";


const client = new Client({
    user: Deno.env.get("DATABASE_USER"),
    password: Deno.env.get("DATABASE_PASSWORD"),
    database: "yelp",
    hostname: Deno.env.get("DATABASE_IP"),
    port: 5432,
});

await client.connect();

export function get_client() {
    return client;
}