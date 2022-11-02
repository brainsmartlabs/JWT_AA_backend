const express = require('express');
const userRouter = express.Router();
const { getAllUsers, signUp, loginUser, verifyToken, getUser, refreshToken } = require('../controllers/user-controller');

userRouter.get('/', getAllUsers);
userRouter.post('/signup', signUp);
userRouter.post('/login', loginUser);
userRouter.get('/user', verifyToken, getUser);


module.exports.userRouter = userRouter;

