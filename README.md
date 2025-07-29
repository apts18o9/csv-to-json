# CSV to JSON & Age Distribution API

## Overview

This project is a Node.js backend application.It provides a robust API for processing CSV files, transforming their data into a structured JSON format (handling nested properties), persisting this data in a PostgreSQL database, and generating an age distribution report.

A key constraint of this challenge was to implement the CSV parsing logic **without relying on external NPM packages** like `csv-to-json`, ensuring a custom, performant, and maintainable solution.

## Key Features

* **Custom CSV Parsing:** Reads CSV files from a configurable location and converts each row into a rich, nested JSON object. Handles dot-notation in CSV headers (e.g., `address.city` becomes `{ address: { city: '...' } }`) with infinite depth support.
* **PostgreSQL Integration:** Stores processed user data in a `public.users` table, leveraging `jsonb` columns for flexible storage of `address` and `additional_info` fields.
* **Data Transformation:** Maps CSV data fields to the specified database schema, combining `firstName` and `lastName` into a single `name` field, extracting `age`, and intelligently categorizing remaining properties into `address` and `additional_info` JSONB columns.
* **Atomic Database Insertion:** Utilizes PostgreSQL transactions to ensure that all records from a single CSV file are inserted as an atomic unit; if any error occurs, the entire batch is rolled back.
* **Age Distribution Reporting:** Calculates and prints a detailed age distribution report to the console after successful data upload, adhering to the specified age groups and percentage format.
* **Environment-based Configuration:** Uses `.env` files for managing sensitive information and configurable paths (like CSV file location and database connection string).
* **Robust Error Handling:** Comprehensive error handling throughout the file reading, parsing, transformation, and database insertion processes.

## Technologies Used

* **Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** PostgreSQL
* **Database Driver:** `pg` (Node.js PostgreSQL client)
* **Environment Variables:** `dotenv`
* **File System Operations:** Node.js `fs.promises`

## SCREENSHOT OF THE CONSOLE
<img width="636" height="517" alt="Screenshot 2025-07-29 124849" src="https://github.com/user-attachments/assets/e185b6ef-045d-453e-a1b2-3d99ff0c2cb1" />

