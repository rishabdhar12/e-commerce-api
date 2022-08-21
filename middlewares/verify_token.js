const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers.token;

    if(!bearerToken){
        res.json({status: 400, message: "Missing token"});
        return;
    }

    try {
        const verified = await jwt.verify(bearerToken, process.env.TOKEN_SEC);
        req.user = verified;
        next();
    }catch(e) {
        res.json({status: 401, message: "Invalid token" + e});
    }
};

const verifyTokenAndAdmin = async (req, res, next) => {
    const bearerToken = req.headers.token;

    if(!bearerToken) {
        res.json({status: 400, message: "Missing token"});
        return;
    }


    try {
        const verified = await jwt.verify(bearerToken, process.env.TOKEN_SEC);
        req.user = verified;

        if(req.user.isAdmin == false){
            res.json({status: 300, message: "Forbidden"});
            return;
        }
        next();
    }catch(e) {
        res.json({status: 401, message: "Invalid token " + e});
    }
};

module.exports = {verifyToken, verifyTokenAndAdmin};
