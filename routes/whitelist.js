require('dotenv').config()

const moment = require("moment");
const { ethers } = require("ethers");
const createError = require('http-errors')
const db = require('../db')

let express = require('express');
let router = express.Router();

function addressValidation(address){
    const regex = /(0x[a-fA-F0-9]{40})/g;
    if (!regex.exec(address)) return false;
    return address.toLowerCase();
}

//생성 시 유효성을 검사하는 이더리움 지갑 Class
class Wallet {
    address = "";
    whitelisted = false;
    first_tx_hash = null;
    first_tx_time = null;
    first_tx_block = null;
    date_info = null;

    constructor(address){

        let buff = addressValidation(address);
        if(!buff){
            console.log("invalid wallet : " + address);
            //유효하지 않은 주소
            this.valid = false;
            this.address = address;
        }
        else
        {
            //유효한 주소
            this.valid = true;
            this.address = address.toLowerCase();
        }
    }

    //화이트리스트 정보 업데이트
    async update (first_tx_hash, first_tx_time, first_tx_block, res){
        this.whitelisted = true;
        this.year = new Date(first_tx_time).getFullYear();
        this.first_tx_hash = first_tx_hash;
        this.first_tx_time = first_tx_time;
        this.first_tx_block = first_tx_block.toLocaleString('en-US');
        this.date_info = await getDateInfo(first_tx_time, res);
    }

    toJSON (){
        console.log("debug:first_tx_time:" + this.first_tx_time);
        return{
            address : this.address,
            year : this.year,
            first_tx_hash : this.first_tx_hash,
            first_tx_time : this.first_tx_time,
            first_tx_block : this.first_tx_block,
            date_info : this.date_info
        }
    }
}

async function getDateInfo(date, res){
    let dateString = moment(date).format('YYYY-MM-DD').toString();
    console.log("debug:date : " + date);
    console.log("debug:dateString : " + dateString);

    let connection = null;
    try{
        connection = await db.getConnection();
        // where `date` =" + dateString;
        const sql = "SELECT * FROM dateinfo WHERE date_string=\'" + dateString + "\'";
        console.log(sql);
        const [ result ] = await connection.query(sql);
        let info = result[0];
        info.created_per_day = info.created_per_day.toLocaleString('en-US');
        info.created_acc = info.created_acc.toLocaleString('en-US');
        info.total_wallet_count = info.total_wallet_count.toLocaleString('en-US');
        info.top_percent = (info.top_percent * 100).toFixed(4) + "%";
        return info;

    }catch(error){
        let now = new Date();
        console.log(now);
        console.log(error);
        res.status(404).json(
            {
                message : "DB Error 2",
                date : now
            });
        return false;
    }finally {
        if(connection != null){
            connection.release();
        }
    }
}

async function updateAddressInfo(wallet, res){
    let connection = null;
    try{
        connection = await db.getConnection();
        const sql = "SELECT * FROM whitelist WHERE from_address=\'" + wallet.address + "\'";
        const [ result ] = await connection.query(sql);
        console.log(result);
        if(result.length == 0){
            //화이트리스트 db에 없는 경우
            console.log("not whitelisted wallet : " + wallet.address);
            res.status(418).json({ message : "I'm a teapot"});
            return false;
        }
        else
        {
            //화이트리스트 DB에 있다면 정보 업데이트
            await wallet.update(result[0].hash, result[0].block_timestamp, result[0].block_number, res);
            console.log("whitelisted wallet : " + wallet.address);
            return true;
        }
    }catch(error){
        let now = new Date();
        console.log(now);
        console.log(error);
        res.status(404).json(
            {
                message : "DB Error",
                date : now
            });
        return false;
    }finally {
        if(connection != null){
            connection.release();
        }
    }
}
//지갑 정보
router.get("/info", async (req, res) => {
    let wallet = new Wallet(req.query.address);
    if(!wallet.valid){
        //유효하지 않은 주소는 DB를 조회하지 않는다
        res.status(418).json({ message : "I'm a teapot"});
        return;
    }

    //이미 4xx 응답된 경우
    if(!await updateAddressInfo(wallet, res)) return;
    res.json(wallet.toJSON());
});

// 서명된 화이트리스트 티켓 받기
router.get("/ticket", async (req, res) => {
    let wallet = new Wallet(req.query.address);
    if(!wallet.valid){
        //유효하지 않은 주소는 DB를 조회하지 않는다
        res.status(418).json({ message : "I'm a teapot"});
        return;
    }

    //이미 4xx 응답된 경우
    if(!await updateAddressInfo(wallet, res)) return;

    try {
        if (wallet.whitelisted) {
            let signer = new ethers.Wallet(process.env.WL_SIGNER_PK);
            //서명 메시지 생성 [민터주소, 발행년도, opb sale 컨트렉 주소]
            let messageHash = ethers.utils.solidityKeccak256(
                [
                    'address',
                    'uint256',
                    'address'
                ],
                [
                    wallet.address,
                    new Date(wallet.first_tx_time).getFullYear(),
                    process.env.SALE_CONTRACT_ADDRESS,
                ]
            );

            //32 bytes array 를 Uint8 array로 형변환
            let messageHashBinary = await ethers.utils.arrayify(messageHash);
            console.log("hash:" + messageHashBinary);

            //SIGNER PK로 서명
            let signature = await signer.signMessage(messageHashBinary);
            console.log("signature:" + signature)

            res.json({
                year: new Date(wallet.first_tx_time).getFullYear(),
                ticket_hash: messageHash,
                ticket_signature: signature
            })

        } else {
            //유효하지 않은 경우
            res.status(418).json({ message : "I'm a teapot"});
        }
    }catch (error){
        let now = new Date();
        console.log(now);
        console.log(error);
        res.status(400).json(
            {
                message : "SIGN Error",
                date : now
            });
    }

});

module.exports = router;