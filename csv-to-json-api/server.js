require('dotenv').config();

//testing
const db = require('./src/config/db');
const { parseCsvFile } = require('./src/utils/csvParser');
//all imports
const { transformUserData } = require('./src/utils/dataTransformer');
const { insertUsers, clearUsersTable } = require('./src/services/userService');
const { generateAgeDistributionReport } = require('./src/services/reportService')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const CSV_FILE_PATH = process.env.CSV_FILE_PATH

app.use(express.json());

app.get('/', (req, res) => {
    res.send('CSV to JSON API is running');
});

//MAIN API to process CSV
app.post('/process-csv', async (req, res) => {
    if (!CSV_FILE_PATH) {
        console.error('CSV_FILE_PATH is not defined.');
        return res.status(500).json({ message: 'Server error, file path not correct' })

    }

    try {

        console.log(`\n--- Starting CSV processing for ${CSV_FILE_PATH} ---`);

        // if you want to append new data without clearing.
        await clearUsersTable();

        //  Parse the CSV file
        const parsedData = await parseCsvFile(CSV_FILE_PATH);
        console.log(`Parsed ${parsedData.length} records from CSV.`);

        //  Transform the parsed data for database insertion
        const transformedData = parsedData.map(transformUserData);
        console.log(`Transformed ${transformedData.length} records for database insertion.`);

        //  Insert transformed data into the database
        const insertedCount = await insertUsers(transformedData);
        console.log(`Successfully inserted ${insertedCount} records into the database.`);

        // Generate and print the age distribution report
        await generateAgeDistributionReport();

        res.status(200).json({
            message: 'CSV processed and data uploaded successfully!',
            insertedCount: insertedCount,
            reportGenerated: true
        });

    } catch (error) { //show errors
        console.error('An error occured during CSV processing', error.message);
        res.status(500).json({
            message: 'Failed to process CSV and upload data',
            error: error.message,
        })
        
    }
})

//starting server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database connection was checked on starting.');
    
});


