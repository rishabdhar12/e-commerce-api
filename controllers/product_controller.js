const { v4: uuidv4 } = require('uuid');
const router = require("express").Router();
const fs = require("fs");

const productModel = require("../models/product_model.js");

const tokenVerification = require("../middlewares/verify_token.js")
const paginatedResults = require("../middlewares/paginated.js");

const fileUpload = require("../middlewares/file_upload.js");

// Create Product (tried uuid)
router.post("/createProduct", tokenVerification.verifyTokenAndAdmin, fileUpload.single("imagePath"), async (req, res) => {
    const {quantity, title, description, price, manufacturer,
        isAvailable } = req.body;

    if(!quantity || !title || !description || !price || 
        !manufacturer || !isAvailable){
        res.json({status: 400, message: "All the fields are mandatory!"});
    }

    const productId = await uuidv4();

    const newProduct = {
        productCode: productId,
        quantity: quantity,
        title: title,
        imagePath: req.file.filename,
        description: description,
        price: price,
        category: req.body.categoryId,
        brand: req.body.brandId,
        manufacturer: manufacturer,
        isAvailable: true,
    }; 

    try {
        const savedProduct = await productModel.create(newProduct);
        res.json({status: 200, message: "Product added successfully", product: savedProduct});
    }catch(e){
        res.json({status: 400, message: "Unable to create product " + e});
    }

});

// get product 
router.get("/getProduct/:id", async (req, res) => {

    try {
        const product = await productModel.findOne({_id: req.params.id }).populate({path: "brand"}).populate({path: "category"});
        res.json({status: 200, message: "Product found", product: product});
    }catch(e) {
        res.json({status: 400, message: "Error finding product " + e});
    }
});

// Get products.
router.get("/paginatedProducts", paginatedResults(productModel), (req, res) => {
   res.json({status: 200, products: res.paginatedResults}); 
});

// update products 
router.put("/updateProduct/:id", tokenVerification.verifyTokenAndAdmin, async (req, res) => {

    const product = await productModel.findOne({_id: req.params.id});

    if(!product) {
        res.json({status: 400, message: "product doesn't exist"});
        return;
    }

    try {
        const updated = await productModel.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true});

        if(!updated) {
            res.json({status: 400, message: "Unable to update product!"});
            return;
        }else {
            res.json({status: 200, message: "Product updated!", product: updated});
        }

    }catch(e) {
        res.json({status: 400, message: "Unable to update Product!" + e});
    }
});

// Delete product
router.delete("/deleteProduct/:id", tokenVerification.verifyTokenAndAdmin, async (req, res) => {
    try {

        const product = await productModel.findOne({id: req.params.id});

        if(!product) {
            res.json({status: 400, message: "Couldn't find product"});
            return;
        }

        const id = product._id;

        await productModel.findByIdAndDelete({_id: id});

        res.json({status: 200, message: "Product deleted", category: category});

    }catch(e) {
        res.json({status: 400, message: "Failed to delete product! " + e});
    }
});



module.exports = router;






















