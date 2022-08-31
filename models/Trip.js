
const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: /^[A-Za-z0-9]{3,16}$/
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
        // enum: ['India', 'Africa', 'Europe']
    },
    headCount: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    budget: {
        type: Number,
        required: true,
        min: 100,
        max: 10000
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("Trip", TripSchema);