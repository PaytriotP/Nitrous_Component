const { createClient } = require('redis');

async function flush() {
  if (!process.env.REDIS_URL) {
    console.log('No REDIS_URL provided, skipping flush.');
    return;
  }
  console.log(`Connecting to Redis at ${process.env.REDIS_URL}...`);
  try {
    const client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    await client.flushAll();
    console.log('Successfully flushed Redis cache!');
    await client.quit();
  } catch (e) {
    console.error('Failed to flush Redis:', e.message);
  }
}

flush();
