const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://snovaapp:Ghbdtnjvktn@188.120.246.132:5433/snovadatabase',
});

module.exports = pool;
