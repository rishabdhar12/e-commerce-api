const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productCode: {
        type: String,
        unique: true,
        required: true,
    },
    quantity: {
        type: Number,
        requried: true,
        default: 0,
    },
    title: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorySchema",
    }],
    brand: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "brandModel",
    }],
    manufacturer: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: true,
    },
},
    { collection: "products" },
    { timestamp: true },
);


module.exports = new mongoose.model("productModel", productSchema);

