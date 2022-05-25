require('dotenv').config()
const express = require("express");
const cors = require("cors");
const indexRouter = require('./routes/index')
const whitelistRouter = require('./routes/whitelist')

const app = express();
app.use(cors());
app.use('/', indexRouter);
app.use('/whitelist', whitelistRouter);

app.listen(3330, () => {
    let host = "http://localhost:3330";
    console.log("env : " + process.env.TITLE);
})