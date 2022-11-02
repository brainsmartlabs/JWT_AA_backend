const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'keyboard_cat';

module.exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;

    let exisitingUser;
    try {
        exisitingUser = await User.findOne({ 'email': email });
    } catch (err) {
        return console.log(err);
    }

    if (exisitingUser)
        return res.status(400).json({ 'message': 'User Already Exists, Please Login' });

    const hashedPassword = bcrypt.hashSync(password, 7);
    const user = new User({
        name,
        email,
        'password': hashedPassword
    });

    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }

    return res.status(200).json({ 'message': 'Account Created Successfully', 'user': user });
}


module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    let exisitingUser;
    try {
        exisitingUser = await User.findOne({ 'email': email });
    } catch (err) {
        return console.log(err);
    }

    if (!exisitingUser)
        return res.status(400).json({ 'message': 'user Email Does not Exisit' });

    const isPasswordCorrect = bcrypt.compareSync(password, exisitingUser.password);

    if (!isPasswordCorrect)
        return res.status(400).json({ 'message': 'Password Did not match, Sorry!!' });

    const token = jwt.sign({ id: exisitingUser._id }, JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: "35s"
    });

    if(req.cookies[`${exisitingUser._id}`]){
        req.cookies[`${exisitingUser._id}`] = ""
    }

    res.cookie(String(exisitingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: "lax"
    });

    return res.status(200).json({ 'message': 'Login Successful', 'status': 'allow' });
}

module.exports.verifyToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    //console.log(cookies);
    if (!cookies)
        return res.status(400).json({ message: "Token has Expired. Re-login" });

    const token = cookies.split("=")[1]

    if (!token)
        return res.status(404).json({ message: "No token found" });

    jwt.verify(String(token), JWT_SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(400).json({ 'message': 'Invalid Token' });
        }
        if (user) {
            //console.log(user.id);
            req.id = user.id
        }
    });
    next();
}

module.exports.getUser = async (req, res) => {
    const userID = req.id;
    let user;
    try {
        user = await User.findById(userID, "-password");
    } catch (err) {
        return console.log(err);
    }

    if (!user)
        return res.status(404).json({ message: "User Not Found", status: 'invalid' });

    return res.status(200).json({ user })
}

module.exports.getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.find({});
    } catch (err) {
        return console.log(err);
    }

    return res.status(200).json({ users });
}


