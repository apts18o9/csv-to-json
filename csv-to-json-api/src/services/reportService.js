//to display the age distribution in console(final output)

const db = require('../config/db')

async function generateAgeDistributionReport(){
    try {

        const result = await db.query('SELECT age FROM public.users');
        const ages = result.rows.map(row => row.age);

        if(ages.length === 0){
            console.log('|n --- Age distribution report---');
            console.log('No users found in database to show report');
            console.log('--------');
            return;
        }
        
        const totalUsers = ages.length;

        let less20 = 0;
        let twentyto40 = 0;
        let fortyto60 = 0;
        let more60 = 0;

        //categorize ages
        ages.forEach(age => {
            if(age < 20){
                less20++;
            }
            else if(age >=20 && age<=40) {
                twentyto40++;
            }
            else if(age > 40 && age<=60){
                fortyto60++;
            }
            else if(age > 60){
                more60++;
            }
        })

        //calculate percent to show in console
        const calculatePercentage = (count) => {
            if(totalUsers === 0) return '0' //to avoid NaN
            return ((count / totalUsers) * 100).toFixed(0);
        }

        //report 
        const report = [
            `"AGE-GROUP, % DISTRIBUTION"`,
            `"<20", ${calculatePercentage(less20)}%`,
            `"20 to 40", ${calculatePercentage(twentyto40)}%`,
            `"40 to 60", ${calculatePercentage(fortyto60)}%`,
            `">60", ${calculatePercentage(more60)}%`
        ].join('\n');


        console.log('\n --- AGE DISTRIBUTION REPORT --- ');
        console.log(report);
        console.log(`Data fetched successfully from ${totalUsers} entries`);
        
        console.log('----------------------\n');
        
        
        

    } catch (error) {
        console.error('Error generating age distribution report', error.message);
        throw new Error(`Failed to generate report: ${error.message}`)
        
    }
}

module.exports = {
    generateAgeDistributionReport
}