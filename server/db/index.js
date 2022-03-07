// Import libraries
const { Pool } = require('pg')

// The pg library will identify the environment variables it needs, if they're not specified in Pool
const pool = new Pool()

module.exports = {
  query: (text, params) => pool.query(text, params),
}