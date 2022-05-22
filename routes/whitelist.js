require('dotenv').config()

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
    update (first_tx_hash, first_tx_time, first_tx_block){
        this.whitelisted = true;
        this.first_tx_hash = first_tx_hash;
        this.first_tx_time = first_tx_time;
        this.first_tx_block = first_tx_block;
    }

    toJSON (){
        return{
            whitelisted: this.whitelisted,
            valid: this.valid,
            address : this.address,
            first_tx_hash : this.first_tx_hash,
            first_tx_time : this.first_tx_time,
            first_tx_block : this.first_tx_block
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
            res.json(wallet.toJSON());
            console.log("not whitelisted wallet : " + wallet.address);
        }
        else
        {
            wallet.update(result[0].hash, result[0].block_timestamp, result[0].block_number);
            console.log("whitelisted wallet : " + wallet.address);
        }
        //return wallet;

    }catch(error){
        let now = new Date();
        console.log(now);
        console.log(error);
        res.status(400).json(
            {
                message : "DB Error",
                date : now
            });
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
        //유효하지 않은 주소는 DB를 조회하지 않고 whitelist false return
        res.json(wallet.toJSON());
        return;
    }
    await updateAddressInfo(wallet, res);
    if(wallet.whitelisted){
        res.json(wallet.toJSON());
    }
});

// 서명된 화이트리스트 티켓 받기
router.get("/ticket", async (req, res) => {
    let wallet = new Wallet(req.query.address);
    if(!wallet.valid){
        //유효하지 않은 주소는 DB를 조회하지 않고 whitelist false return
        res.json(wallet.toJSON());
        return;
    }
    await updateAddressInfo(wallet, res);
    if(wallet.whitelisted){
        res.json(wallet.toJSON());

        let signer = new ethers.Wallet(process.env.WL_SIGNER_PK);
        //서명 메시지 생성 [민터, 팝캣타입, opb 컨트렉 주소]
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

    }

    //서명 메시지 생성 [민터, 팝캣타입, opb 컨트렉 주소]
    let messageHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256', 'address'],
        [validUser.address, '1', opb.address]
    );

    //32 bytes array 를 Uint8 array로 형변환
    let messageHashBinary = await ethers.utils.arrayify(messageHash);

    //정상서명
    let validSignature = await signer.signMessage(messageHashBinary);

    //잘못된서명자
    let invalidSignature = await validUser.signMessage(messageHashBinary);


    let address  = req.query.address;
    let info = addressInfo(address, res)
    console.log("sign whitelist address : " + address);

    //TODO info 데이터로 서명해서 돌려주기
    res.status(200).send("Hello Check!");
});

module.exports = router;