const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:hsUtWfeGSJGhyVygWEnwKGlTrPLSkCsm@yamabiko.proxy.rlwy.net:48353/railway' });
async function run() {
  await client.connect();
  // Divide the amount by 100 to convert from cents to exact decimal format for Medusa v2
  // We only divide if amount >= 1, just to be safe so we don't accidentally divide an already fixed price
  const res = await client.query("UPDATE price SET amount = amount / 100 WHERE amount >= 1");
  console.log(`Updated ${res.rowCount} prices in the DB`);
  await client.end();
}
run();
