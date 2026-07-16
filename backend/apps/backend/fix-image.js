const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:hsUtWfeGSJGhyVygWEnwKGlTrPLSkCsm@yamabiko.proxy.rlwy.net:48353/railway' });
async function run() {
  await client.connect();
  const res = await client.query("UPDATE image SET url = REPLACE(url, 'http://localhost:9000', 'https://nitrouscomponent-production.up.railway.app') WHERE url LIKE 'http://localhost:9000%'");
  console.log(`Updated ${res.rowCount} image URLs in the DB`);
  await client.end();
}
run();
