const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

require("./config/db.config");

app.use(express.json());

// userRoutes
const userRoutes = require("./controllers/auth_controller.js");
app.use("/user", userRoutes);

// categoryRoutes
const categoryRoutes = require("./controllers/category_controller.js");
app.use("/category", categoryRoutes);

// brandRoutes
const brandRoutes = require("./controllers/brand_controller.js");
app.use("/brand", brandRoutes);

// productRoutes
const productRoutes = require("./controllers/product_controller.js");
app.use("/product", productRoutes);

// cartRoutes
const cartRoutes = require("./controllers/cart_controller.js");
app.use("/cart", cartRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});
