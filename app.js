const express = require('express');

const app = express();
const userRouter = require('./routes/user');
const authRouter = require('./routes/authUser');

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/user', authRouter);

module.exports = app;
