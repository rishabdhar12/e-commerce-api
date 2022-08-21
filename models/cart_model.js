const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "productModel",
    }],
    user: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
    }],
    quantity: {
        type: Number,
        required: true,
    },
},
    { collection: "cartSchema" },
    { timestamps: true },
);

module.exports = mongoose.model("cartSchema", cartSchema);
