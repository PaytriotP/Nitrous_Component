import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function fixDbUrls({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  // Actually, we can just use the DB connection directly since we need to do a raw REPLACE
  const { Client } = require('pg');
  const client = new Client({ connectionString: 'postgresql://postgres:hsUtWfeGSJGhyVygWEnwKGlTrPLSkCsm@yamabiko.proxy.rlwy.net:48353/railway' });
  await client.connect();
  const res = await client.query("UPDATE product_image SET url = REPLACE(url, 'http://localhost:9000', 'https://nitrouscomponent-production.up.railway.app') WHERE url LIKE 'http://localhost:9000%'");
  logger.info(`Updated ${res.rowCount} image URLs in the DB`);
  await client.end();
}
