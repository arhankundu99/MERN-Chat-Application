const jsonwebtoken = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token = ""
 
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

        const userId = jsonwebtoken.verify(token, process.env.JWT_SECRET).id;

        const user = await User.findOne({
            _id: userId
        });

        if (user) {
            req.userId = userId;
            return next();
        }

        res.status(401);
        throw new Error("User Not Found. Token failed.");
    }
    else{
        res.status(401);
        throw new Error("Token is Empty.");
    }
});

module.exports = {
    authMiddleware
}