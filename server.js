const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user-routes');
const cookieParser = require('cookie-parser');

const app = express();
mongoose.connect('mongodb+srv://jwtaa_username:jwtaa_password@cluster0.m9n6oq7.mongodb.net/my_app?retryWrites=true&w=majority')
    .then(() => app.listen(3300))
    .then(() => console.log("DB Connected & App started at 3300"))
    .catch(err => console.log(err));

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRouter);



