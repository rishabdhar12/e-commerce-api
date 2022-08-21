const mongoose = require("mongoose");

const brandModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true, 
    },
    description: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },
}, 
    { collection: "brands" },
    { timestamp: true }, 
);

module.exports = mongoose.model("brandModel", brandModel);
