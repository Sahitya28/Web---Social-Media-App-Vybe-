const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kpalsskcpokbyrwdofxl:Ix8mqC74oY8oP5GD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT 1');
  })
  .then((res) => {
    console.log('✅ Query result:', res.rows);
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error(err);
    process.exit(1);
  });