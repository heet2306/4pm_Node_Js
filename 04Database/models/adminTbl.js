const mongoose = require('mongoose')
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: [Number],
        required: true
    },
    city: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
})
const admin = mongoose.model('admin', adminSchema)
module.exports = admin