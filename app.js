const express = require("express");
const indexRouter = require('./routes/index')
const whitelistRouter = require('./routes/whitelist')

const app = express();
app.use('/', indexRouter);
app.use('/whitelist', whitelistRouter);

app.listen(3330, () => {
    let host = "http://localhost:3330";
    console.log(host + "/");
    console.log(host + "/whitelist/check");
    console.log("유효한주소테스트 " + host + "/whitelist/check?address=0x0423E3541477BA8325CC732f67AB5530321B6802");

})