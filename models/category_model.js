const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },

},
    { collection: "categories" },
    { timestamps: true },
);

module.exports = mongoose.model("categorySchema", categorySchema);
