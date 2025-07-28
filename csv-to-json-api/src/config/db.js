//to connect postgre to app

const {Pool} = require('pg');

require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


pool.connect()
    .then(client => {
        console.log('successfully connected to POSTGRE database');
        client.release();
        
    })
    .catch(err => {
        console.log('Error connecting to database', err.message);
        process.exit(1);
        
        
    })


module.exports = {
    query: (text,params) => pool.query(text, params),
    pool,
}