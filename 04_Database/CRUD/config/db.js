const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/CRUD')
const db = mongoose.connection;

db.once('open', (err) => {
    if (err) {
        console.log("Error to connect the DB");
    }
    else {
        console.log("connect to the DB");
    }
})
module.exports = db