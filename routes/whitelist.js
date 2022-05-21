const createError = require('http-errors')
let express = require('express');
let router = express.Router();

const { ethers } = require("ethers");
require('dotenv').config()

/*
200 object sample
{
    address : 0xaa..,
    year : 2017,
    first_tx_hash : 0xaa..,
    first_tx_time : 2017-05-20 19:13:49,
    first_tx_block : 12345
}
*/

function addressInfo(address, res){
    const regex = /(0x[a-fA-F0-9]{40})/g;
    if(!regex.exec(address)) {
        throw new createError(400, "Invalid Address");
    }
    address = address.toLowerCase();

    //TODO : DB Select

    //TODO : DB 없는경우 처리예정
    if(address != "0x0423E3541477BA8325CC732f67AB5530321B6802".toLowerCase()){
        throw new createError(401, "Not whitelisted");
    }
}

//민팅 가능 팝캣 확인하기
router.get("/check", (req, res) => {
    //console.log("check whitelist")
    let address  = req.query.address;
    console.log("check whitelist address : " + address);
    res.json(addressInfo(address, res))
});

// 서명된 화이트리스트 티켓 받기
router.get("/ticket", (req, res) => {
    let address  = req.query.address;
    let info = addressInfo(address, res)
    console.log("sign whitelist address : " + address);
    
    //TODO info 데이터로 서명해서 돌려주기
    res.status(200).send("Hello Check!");
});

module.exports = router;