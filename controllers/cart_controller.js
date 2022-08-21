const cartModel = require("../models/cart_model.js");
const productModel = require("../models/product_model.js");

const router = require("express").Router();
const tokenVerification = require("../middlewares/verify_token.js")
const paginatedResults = require("../middlewares/paginated.js");

// Create cart
router.post("/createCart", tokenVerification.verifyToken, async (req, res) => {
    const newOrder = {
        product: req.body.productId,
        user: req.body.userId,
        quantity: parseInt(req.body.quantity),
    }

    try {
        const stock = await productModel.findById(req.body.productId);
        if(req.body.quantity > stock.quantity) {
            res.json({status: 400, message: "Item out of stock!"});
            return;
        }

        const cartProduct = await cartModel.create(newOrder);
        const update = {quantity: stock.quantity - req.body.quantity};
        await productModel.findByIdAndUpdate(stock.id, update, { new:true });
        res.json({status: 200, message: "Added to cart", product: cartProduct});
    }catch(e) {
        res.json({status: 400, message: "Failed to add to cart " + e });
    }
});


// get Orders 
router.get("/getCart/:id", tokenVerification.verifyToken, async (req, res) => {

    try {
        const product = await cartModel.findById(req.params.id).populate("product", "imagePath title price quantity").populate({path: "user"});
        res.json({status: 200, message: "Cart Info", product: product});
    }catch(e) {
        res.json({status: 400, message: "Failed to add to load cart " + e });
    }
});

// get all orders.
router.get("/getOrders", tokenVerification.verifyToken, async (req, res) => {

    try {
        const product = await cartModel.find({}).populate("product", "imagePath title price quantity").populate({path: "user"});
        res.json({status: 200, message: "Cart Info", product: product});
    }catch(e) {
        res.json({status: 400, message: "Unable to get items in cart", product: product});
    }

});

module.exports = router;
