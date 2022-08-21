const router = require("express").Router();

const categoryModel = require("../models/category_model.js");

const tokenVerification = require("../middlewares/verify_token.js")
const paginatedResults = require("../middlewares/paginated.js");

// Create category (Admin)
router.post("/createCategory", tokenVerification.verifyTokenAndAdmin, async (req, res) => {
    const { title, description, slug } = req.body;

    const categoryExists = categoryModel.findOne({slug: slug});

    if(!categoryExists) {
        res.json({status: 401, message: "Category already exists."});
        return;
    }

    const category = new categoryModel({
        title: title,
        description: description,
        slug: slug,
    });

    try {
        const savedCategory = await category.save();
        res.json({status: 200, message: "Category Added", category: savedCategory});   

    }catch(e) {
        res.json({status: 400, message: "Failed to create category! " + e});
    }
});

// update category
router.put("/updateCategory/:slug", tokenVerification.verifyTokenAndAdmin, async (req, res) => {

    const category = await categoryModel.findOne({slug: req.params.slug});

    if(!category) {
        res.json({status: 400, message: "Category doesn't exist"});
        return;
    }

    try {
        const updated = await categoryModel.findOneAndUpdate({slug: req.params.slug}, {$set: req.body}, {new: true});

        if(!updated) {
            res.json({status: 400, message: "Unable to update category!"});
            return;
        }else {
            res.json({status: 200, message: "Category updated!", category: updated});
        }

    }catch(e) {
        res.json({status: 400, message: "Unable to update Category!" + e});
    }
});

// Delete category
router.delete("/deleteCategory/:slug", tokenVerification.verifyTokenAndAdmin, async (req, res) => {
    try {

        const category = await categoryModel.findOne({slug: req.params.slug});

        if(!category) {
            res.json({status: 400, message: "Couldn't find category"});
            return;
        }

        const id = category._id;

        await categoryModel.findByIdAndDelete({_id: id});

        res.json({status: 200, message: "Category deleted", category: category});

    }catch(e) {
        res.json({status: 400, message: "Failed to delete category! " + e});
    }
});


// GET CATEGORIES (PAGINATED)
router.get("/paginatedCategories", paginatedResults(categoryModel), tokenVerification.verifyToken, async (req, res) => {
    res.json({status: 200, result: res.paginatedResults});
});


// GET CATEGORY
router.get("/fetchCategory/:slug", tokenVerification.verifyToken, async (req, res) => {
    
    try {
        
        const category = await categoryModel.findOne({slug: req.params.slug});

        if(!category) {
            res.json({status: 400, message: "Cannot find category. Please check slug!"});
            return;
        }else{
            res.json({status: 200, message: "Found category!", category: category});
        }

    }catch(e) {
        res.json({status: 400, message: "Error fetching category " + e});
    }
});

module.exports = router;



























