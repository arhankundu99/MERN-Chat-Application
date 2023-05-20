const asyncHandler = require('express-async-handler');
const generateToken = require('../db/generateToken');
const User = require('../models/user')

const register = asyncHandler(async (req, res) => {
    const {name, email, password, pic} = req.body;
    console.log(name, email, password)
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the fields")
    }

    const userExists = await User.findOne({
        email
    });

    if(userExists){
        res.status(400);
        throw new Error("User already exists.");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if(user){
        return res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }
    else{
        res.status(500);
        throw new Error("Unable to register user.")
    }
});

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({
        email,
    });

    if(!user){
        res.status(400);
        throw new Error("User not found. Error while logging in.");
    }

    else{
        if(await user.matchPassword(password)){
            res.status(200).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            });
        }
        else{
            res.status(400);
            throw new Error("Incorrect Password. Error while logging in.");
        }
    }
})

const getAllUsers = asyncHandler(async(req, res) => {
    const { name } = req.query;
    const searchQuery = name? {
        name: { $regex: name, $options: "i"}
    }: {}
    const users = await User.find(searchQuery);

    if(users){
        return res.status(200).send(users);
    }
    else{
        res.status(400)
        throw new Error("Unable to fetch users.");
    }
});

const getUser = asyncHandler(async(req, res) => {

    const user = await User.findOne({
        _id: req.userId
    });

    if(user){
        return res.status(200).send(user);
    }
    else{
        res.status(400)
        throw new Error("Unable to fetch user.");
    }
});

module.exports = {
    register,
    login,
    getAllUsers,
    getUser
}