const router = require("express").Router();

const brandModel = require("../models/brand_model.js");

const tokenVerification = require("../middlewares/verify_token.js")
const paginatedResults = require("../middlewares/paginated.js");

// Create brand (Admin)
router.post("/createbrand", tokenVerification.verifyTokenAndAdmin, async (req, res) => {
    const { title, description, slug } = req.body;

    const brandExists = brandModel.findOne({slug: slug});

    if(!brandExists) {
        res.json({status: 401, message: "brand already exists."});
        return;
    }

    const brand = new brandModel({
        title: title,
        description: description,
        slug: slug,
    });

    try {
        const savedbrand = await brand.save();
        res.json({status: 200, message: "brand Added", brand: savedbrand});   

    }catch(e) {
        res.json({status: 400, message: "Failed to create brand! " + e});
    }
});

// update brand
router.put("/updatebrand/:slug", tokenVerification.verifyTokenAndAdmin, async (req, res) => {

    const brand = await brandModel.findOne({slug: req.params.slug});

    if(!brand) {
        res.json({status: 400, message: "brand doesn't exist"});
        return;
    }

    try {
        const updated = await brandModel.findOneAndUpdate({slug: req.params.slug}, {$set: req.body}, {new: true});

        if(!updated) {
            res.json({status: 400, message: "Unable to update brand!"});
            return;
        }else {
            res.json({status: 200, message: "brand updated!", brand: updated});
        }

    }catch(e) {
        res.json({status: 400, message: "Unable to update brand!" + e});
    }
});

// Delete brand
router.delete("/deletebrand/:slug", tokenVerification.verifyTokenAndAdmin, async (req, res) => {
    try {

        const brand = await brandModel.findOne({slug: req.params.slug});

        if(!brand) {
            res.json({status: 400, message: "Couldn't find brand"});
            return;
        }

        const id = brand._id;

        await brandModel.findByIdAndDelete({_id: id});

        res.json({status: 200, message: "brand deleted", brand: brand});

    }catch(e) {
        res.json({status: 400, message: "Failed to delete brand! " + e});
    }
});


// GET CATEGORIES (PAGINATED)
router.get("/paginatedCategories", paginatedResults(brandModel), tokenVerification.verifyToken, async (req, res) => {
    res.json({status: 200, result: res.paginatedResults});
});


// GET brand
router.get("/fetchbrand/:slug", tokenVerification.verifyToken, async (req, res) => {
    
    try {
        
        const brand = await brandModel.findOne({slug: req.params.slug});

        if(!brand) {
            res.json({status: 400, message: "Cannot find brand. Please check slug!"});
            return;
        }else{
            res.json({status: 200, message: "Found brand!", brand: brand});
        }

    }catch(e) {
        res.json({status: 400, message: "Error fetching brand " + e});
    }
});

module.exports = router;
