require('dotenv').config();
const express = require("express");
const cors = require("cors");
const indexRouter = require('./routes/index');
const whitelistRouter = require('./routes/whitelist');
const metadataRouter = require('./routes/metadata');
const xpassRouter = require('./routes/xpass');

// let corsOptions = {
//     origin: 'https://oldpopcatbasterds.wtf',
//     credentials: true
// }

const allowlist = ['https://oldpopcatbasterds.wtf', 'https://v2.dogesound.club', 'https://egsa.io/'];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;

    console.log(req.header('origin'))
    let isDomainAllowed = allowlist.indexOf(req.header('origin')) !== -1;

    if (isDomainAllowed) {
        corsOptions = { 
            origin: true ,
            credentials: true
        }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

const app = express();
//app.use(cors(corsOptions));
app.use(cors(corsOptionsDelegate));
app.use('/', indexRouter);
app.use('/whitelist', whitelistRouter);
app.use('/metadata', metadataRouter);
app.use('/xpass', xpassRouter);

app.listen(3330, () => {
    //let host = "http://localhost:3330";
    console.log("env : " + process.env.TITLE);
})