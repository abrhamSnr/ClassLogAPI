const express = require('express');
const cookiePareser = require('cookie-parser');
const cors = require('cors');

const app = express();
const userRouter = require('./routes/user');
const authRouter = require('./routes/authUser');

app.use(cors());
app.use(cookiePareser());
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/user', authRouter);

module.exports = app;
