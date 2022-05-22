# old-popcat-bastards-server
OPB Gasless WL server

![opb-flow](./image/opb-flow.png)


### API DOCS
- API DOCS 링크는 요청시 개별 전달

#### 응답코드 요약

- `200` 정상 응답
![200](https://http.cat/200) 
  

- `418` 서버는 커피를 찻 주전자에 끓이는 것을 거절합니다
![418](https://http.cat/418)
  

- `400` 서버 오류입니다
![400](https://http.cat/400)

### 서명 구조
```
//지갑주소, 발행연도, 세일 컨트렉트 주소로 서명 메시지 생성
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

//SIGNER PK로 서명
let signature = await signer.signMessage(messageHashBinary);

//클라이언트 응답
res.json({
    whitelisted: true,
    year: new Date(wallet.first_tx_time).getFullYear(),
    ticket_hash: messageHashBinary,
    ticket_signature: signature
})

```
