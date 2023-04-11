require('dotenv').config() //pulls all .env file variables

const Pool = require('pg').Pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST, 
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD, 
//   port: process.env.DB_PORT,
// })
const pool = new Pool({ // create connection to database
  connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
  ssl: {
    rejectUnauthorized: false // don't check for SSL cert
  }
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
}
