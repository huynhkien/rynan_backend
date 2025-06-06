const mongoose = require('mongoose');
const config = require('./config');
async function connect() {
    try{
       await mongoose.connect(config.db.uri, {
        ssl: true,                    
});
       console.log("Connected MongoDB Successfully");
    }catch(error){
        console.log(`Connect MongoDB Failure: ${error}`)
    }
}

module.exports = {connect};