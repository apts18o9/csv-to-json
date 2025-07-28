//to save the data in the person.users (db)

const db = require('../config/db');

async function insertUsers(users){
    if(!users || users.length === 0){
        console.log('No user to insert');
        return 0;
    }

    const client = await db.pool.connect() //get client from pool
    let insertedRows = 0;

    try {
        await client.query('BEGIN') //satrt the process

        const insertQuery = `
        INSERT INTO public.users (name, age,address, additional_info)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `;

        for(const user of users){
            const values = [
                user.name,
                user.age,
                user.address,
                user.additional_info
            ];

            await client.query(insertQuery, values)
            insertedRows++;
        }
        
        await client.query('COMMIT');
        console.log(`Successfully inserted ${insertedRows} users into database`);
        return insertedRows;
        

    } catch (error) {
        await client.query('ROLLBACK') //rollback to report an error
        console.error('Error inserting users into database', error.message);
        throw new Error(`Database insertion failed: ${error.message}`)
        
    } finally{
        client.release() //release client 
    }

}

//to clear the table before new insertion
async function clearUsersTable() {
    const client = await db.pool.connect();
    try {
        await client.query('DELETE FROM public.users;');
        console.log('Cleared all records from public.users table.');
    } catch (error) {
        console.error('Error clearing public.users table:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    insertUsers,
    clearUsersTable
}