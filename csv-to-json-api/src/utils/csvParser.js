//file for parsing logic

const fs = require('fs');

const path = require('path')

function setNestedProperty(obj, path, value){
    const parts = path.split('.');
    const current=  obj;

    for(let i = 0; i<parts.length; i++){
        const part = parts[i];

        if(i === parts.length - 1){ //last part(single value)
            current[path] = value;
        }
        else{
            if(!current[path] || typeof current[path] !== 'object'){
                current[path] = {};
            }
            current = current[path];
        }
    }
}


async function parseCsvFile(filePath, delimiter = ','){
    try {

        const absolutePath = path.resolve(filePath)
        const fileContent = await fs.readFile(absolutePath, {encoding: 'utf-8'})

        const lines = fileContent.trim().split('\n');
        if(lines.length === 0){
            return [];
        }

        const headers = lines[0].split(delimiter).map(header => header.trim());
        const dataRows = lines.slice(1);

        const parsedData = dataRows.map(row => {
            const rows = row.split(delimiter).map(value => value.trim());
            const rowObject = {};

            headers.forEach((header, index) => {
                const value = values[index];
                if(value !== undefined && value !== null && value !== ''){
                    setNestedProperty(rowObject, header,value);
                }
            });
            return rowObject;
        })
        
    } catch (error) {
        console.error(`Error parsing CSV file: ${filePath}`, error.message);
        throw new Error(`Failed to parse CSV: ${error.message}`)
        
    }
}

module.exports = {
    parseCsvFile
}