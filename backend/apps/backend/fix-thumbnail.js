const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:hsUtWfeGSJGhyVygWEnwKGlTrPLSkCsm@yamabiko.proxy.rlwy.net:48353/railway' });
async function run() {
  await client.connect();
  const res = await client.query("UPDATE product SET thumbnail = 'https://nitrous-component.vercel.app/' || (metadata->>'image_file') WHERE metadata->>'image_file' IS NOT NULL");
  console.log(`Updated ${res.rowCount} product thumbnails in the DB to use Vercel URLs`);
  await client.end();
}
run();
