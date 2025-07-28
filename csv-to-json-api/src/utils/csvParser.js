//file for parsing logic

const fs = require('fs').promises;

const path = require('path')

function setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
            // Last part, set the value
            current[part] = value;
        } else {
            // Not the last part, navigate or create new nested object
            if (!current[part] || typeof current[part] !== 'object') {
                current[part] = {};
            }
            current = current[part];
        }
    }
}


async function parseCsvFile(filePath, delimiter = ',') {
    try {
        const absolutePath = path.resolve(filePath);
        const fileContent = await fs.readFile(absolutePath, { encoding: 'utf8' });

        const lines = fileContent.trim().split('\n');
        if (lines.length === 0) {
            return [];
        }

        const headers = lines[0].split(delimiter).map(header => header.trim());
        const dataRows = lines.slice(1);

        const parsedData = dataRows.map(row => {
            const values = row.split(delimiter).map(value => value.trim());
            const rowObject = {};

            headers.forEach((header, index) => {
                const value = values[index];
                if (value !== undefined && value !== null && value !== '') { // Only set if value exists
                    setNestedProperty(rowObject, header, value);
                }
            });
            return rowObject;
        });

        console.log(`Successfully parsed ${parsedData.length} records from ${filePath}`);
        return parsedData;

    } catch (error) {
        console.error(`Error parsing CSV file ${filePath}:`, error.message);
        throw new Error(`Failed to parse CSV: ${error.message}`);
    }
}

module.exports = {
    parseCsvFile
};