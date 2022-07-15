require('dotenv').config();
const express = require("express");
const indexRouter = require('./routes/index');
const whitelistRouter = require('./routes/whitelist');
const metadataRouter = require('./routes/metadata');
const xpassRouter = require('./routes/xpass');

const allowedOrigins = ['https://oldpopcatbasterds.wtf', 'https://v2.dogesound.club', 'https://egsa.io/'];
const app = express();

app.use(function (req, res, next) {
    console.log(req.headers.origin)
    if(allowedOrigins.indexOf(req.headers.origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
})

app.use('/', indexRouter);
app.use('/whitelist', whitelistRouter);
app.use('/metadata', metadataRouter);
app.use('/xpass', xpassRouter);

app.listen(3330, () => {
    //let host = "http://localhost:3330";
    console.log("env : " + process.env.TITLE);
})