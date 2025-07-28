//to transform the json data into db based schema 

function transformUserData(parsedUser){
    const transformed = {
        name: null,
        age: null,
        address: null,
        additional_info: null,
    };

    const additionalInfo = {} //to store any other key detail if missed 

    //processing name from json
    if(parsedUser.name && typeof parsedUser.name === 'object'){
        const parts = []; //array to store the names and then at last add them to make 1+2
        if(parsedUser.name.firstName){
            parts.push(parsedUser.name.firstName);
        }

        if(parsedUser.name.lastName){
            parts.push(parsedUser.name.secondName);
        }
        
        transformed.name = parts.join(' ').trim() || null; //adding both names here
    }

    //processing age
    if(parsedUser.age !== undefined && parsedUser.age !== null && parsedUser.age !== ''){
        const parsedAge = parseInt(parsedUser.age, 10);
        if(!isNaN(parsedAge)){
            transformed.age = parsedAge;
        }
        else{
            console.warn(`Invalid age value: ${parsedUser.age} for user`);
            
        }
    }

    //processing address
    if(parsedUser.address && typeof parsedUser.address === 'object' && Object.keys(parsedUser.address).length > 0){
        transformed.address = {...parsedUser.address};
    }

    //check for any top level keys if missed

    for(const key in parsedUser){
        if(Object.prototype.hasOwnProperty.call(parsedUser, key)){
            //skip field name, age, address
            if(key === 'name' || key === 'age' || key === 'address'){
                continue;
            }
            additionalInfo[key] = parsedUser[key];
        }
    }

    //set additional_info to null if not found
    if(Object.keys(additionalInfo).length > 0 ){
        transformed.additional_info = additionalInfo;
    }

    return transformed;
}

module.exports = {
    transformUserData
}