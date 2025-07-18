const mongosse = require('mongoose')
mongosse.connect('mongodb://127.0.0.1/CRUD')
const db = mongosse.connection
db.once('open', (err) => {
    if (err) {
        console.log("Error fetch");
    }
    console.log("Database connection is done");
})  

module.exports = db;