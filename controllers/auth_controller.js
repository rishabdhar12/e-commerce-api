const bcrypt = require("bcryptjs");

const userModel = require("../models/user_model");
const paginatedResults = require("../middlewares/paginated.js");

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const tokenAuth = require("../middlewares/verify_token.js");

const { twilio, generateOTP } = require("../config/otp.utils.js");


// REGISTER
router.post("/register", async (req, res) => {
    const { username, email, password, name, phoneNo, isAdmin } = req.body;

    if (!username || !email || !password || !name || !phoneNo) {
        // res.sendStatus(400);
        res.json({ status: "400", message: "All fields are mandatory" });
        return;
    }

    const emailExists = await userModel.findOne({ email: email });

    if (emailExists) {
        res.json({ status: "401", message: "Email already exists" });
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
        username: username,
        email: email,
        password: hashPassword.toString(),
        name: name,
        phoneNo: phoneNo,
        otp: "",
        isAdmin: isAdmin,
    });

    try {
        const saveUser = await user.save();
        res.json({ status: "200", message: "User Registered", user: saveUser });
    } catch (e) {
        res.json({ status: "400", message: `Failed to register user ${e}` });
    }
});

// LOGIN (Username || password)
router.get("/login", async (req, res) => {
    try {
        if (
            (!!req.body.username && !!req.body.email) ||
            (!req.body.username && !req.body.email)
        ) {
            res.json({ status: "400", message: "Enter either username or email" });
            return;
        }

        if (!req.body.password) {
            res.json({ status: "400", message: "Password cannot be empty" });
            return;
        }


        const userExists = await userModel.findOne(
            req.body.email
            ? { email: req.body.email }
            : { username: req.body.username }
        );

        if (!userExists) {
            res.json({ status: "401", message: "User doesn't exist" });
            return;
        }

        if (!(await bcrypt.compare(req.body.password, userExists.password))) {
            res.json({ status: "400", message: "Incorrect Password" });
        }

        const token = await jwt.sign({_id: userExists._id}, process.env.TOKEN_SEC,
            {expiresIn: "30d"});

        userExists.token = token;

        const { password, ...others } = userExists._doc;

        res.json({ status: "200", message: "Logged In", user: others });
    } catch (e) {
        res.json({ status: "400", message: `Failed to login ${e}` });
    }
});

// LOGIN (Phone number)
router.post("/loginWithPhone", async (req, res) => {
    //const { phone } = req.body.phoneNo;

    if(!req.body.phone) {
        res.json({status: 401, message: "Phone number is required"});
        return;
    }

    try {
        const userExists = userModel.findOne({phoneNo: req.body.phone});

        if(!userExists) {
            res.json({status: 401, message: "User doesn't exist"});
            return;
        }

        const generated = generateOTP(6);

        await twilio(req.body.phone, generated).then(message => {
            res.json({message: "Otp sent", OTP: generated, output: message});
        });



        const updated = await userModel.findOneAndUpdate({otp: generated});

        if(updated) {
            res.json({status: 200, message: "Updated OTP"});
        } else {
            res.json({status: 400, message: "Can't Update OTP"});
        }

    }catch(e) {
        res.json({status: 400, message: "Error sending OTP" + e});
    }

});


// Verify Otp
router.post("/verifyOtp", async (req, res) => {
    try {

        const user = await userModel.findOne({phoneNo: req.body.phoneNo});

        if(!user) {
            res.json({status: 400, message: "Can't find user"});
            return;
        }

        if(user.otp == req.body.otp) {
            user.otp = "";

            // Test it
            const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SEC,
                {expiresIn: "30d"});

            userExists.token = token;

            await user.save();
            // const updated = await userModel.findOneAndUpdate({otp: ""});
            res.json({status: 200, message: "Verifed"});
        } else {
            res.json({status: 400, message: "Not Verifed"});    
            return;
        }
    }catch(e) {
        res.json({ status: 400, message: "Unable to verify OTP "+ e });
    }

});


// GET ALL USERS.
router.get("/paginatedUsers", paginatedResults(userModel), tokenAuth.verifyToken, async (req, res) => {
    res.json({status: 200, result: res.paginatedResults});
});


// Fetch individual user.
router.get("/getUser", tokenAuth.verifyToken,  async (req, res) => {
    if (
        (!!req.body.username && !!req.body.email) ||
        (!req.body.username && !req.body.email)
    ) {
        res.json({ status: "400", message: "Enter either username or email" });
        return;
    }
    try {
        const allUsers = await userModel.findOne(req.body.email ? {email: req.body.email} : {username: req.body.username});

        // const { password, ...others } = allUsers._doc;
        res.json({ status: "200", users: allUsers });
    } catch (e) {
        res.json({ status: "400", message: `Failed to fetch user ${e}` });
    }
});

// Update User
router.put("/updateUser/:id", tokenAuth.verifyToken, async(req, res) => {
    try {
        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true });

        if(!updatedUser) {
            res.json({status: 401, message: "Unable to update user."});
            return;
        }else {
            const {password, ...others} = updatedUser._doc;
            res.json({status: 200, message: "User updated successfully.", user: others});
        }

    }catch(e) {
        res.json({status: 400, message: "Unable to update user " + e})
    }
});

// Delete User
router.delete("/deleteUser/:id", tokenAuth.verifyTokenAndAdmin, async(req, res) => {
    try {
        const deleteUser = await userModel.findByIdAndDelete(req.params.id);

        if(deleteUser){
            res.json({status: 200, message: "User deleted!"});
        }else {
            res.json({status: 400, message: "Unable to delete user!"});
        }
    }catch(e) {
        res.json({status: 400, message: "Unable to delete user!" + e});
    }

});

module.exports = router;
















