# old-popcat-bastards-server
OPB Gasless WL server

![opb-flow](./image/opb-flow.png)

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

### API DOCS
- API DOCS 링크는 요청시 개별 전달

#### PRO TIP
- 사전 정의된 모든 경우의 수에는 2xx 응답
  - 모든 2xx 응답엔 `whitelist` 라는 key가 존재
    - `ture` 정상 참여자
    - `false` api docs 참고하여 front-end 예외처리
- 사전 정의되지 않은 모든 경우의 수에는 `4xx` 응답
  - 응답값 전달 시 로그 확인 가능



   
### 요구사항 아카이브
과거버전, 메모용


1. 단순 참여조회 flow
- 프론트에서 {address:지갑주소}를 백엔드에게 전달하며 단순 조회 요청
- 백엔드가 {address:지갑주소}, {createdAt:지갑생성일시}, {popcatType:구매가능토큰타입} 프론트에게 전달.
  (보낸 tx를 조회할 수 없는 경우 혹은 스냅샷 일자인 5월 10일이 지난 경우 createdAt 과 popcatType key가 없음.)
- 프론트는 세일 컨트렉트에 address의 didBuy 플래그 확인하여 미구매자인 경우 구매 가능함을 표기. (인당 하나까지만 발행 가능한 경우..)

2. 구매 flow
- 프론트에서 {address:지갑주소}를 백엔드에게 전달하며 서명 요청
- 백엔드가 {address:지갑주소}, {createdAt:지갑생성일시}, {popcatType:구매가능토큰타입}, {saleContractAddress:세일계약주소},{hash:hash}, {signature:signature} 를 클라에게 전달
  위 내용 중 hash, signature는 [ {address:지갑주소}, {createdAt:지갑생성일시}, {popcatType:구매가능토큰타입}, {saleContractAddress:세일계약주소}](이하 서명내용) 을 WL Key로 서명한 값임. 서명시 EIP 712준수 필요.
-  프론트는 전달받은 모든 내용을 세일 컨트렉트에 전달하며 mint 요청
   _address, _createdAt, _popcatType , _saleContractAddress, _hash, _signature

   민트-1. 전달받은 인자와 hash가 동일한지 검증한다.
   https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/mocks/ECDSAMock.sol
   bytes32 verifyHash = keccak256(
   abi.encodePacked(
   _address,
   _createdAt,
   _popcatType,
   _saleContractAddress
   )
   위 값을 toEthSignedMessage한 값이 인자로 받은 _hash와 같은지.

   민트-2. 앞 절차에서 검증된 _hash를 미리 지정된 WL_MANAGER (서버가 PK가진 그 주소!)가 서명하였는지 확인한다
   https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/mocks/SignatureCheckerMock.sol
   isValidSignatureNow(address(WL_MANAGER), _hash, _signature)


 민트-3. 앞 두 절차를 통과했다면 몇가지 더 체크한다
 msg.sender == _address //서명을 들고온 사람이 tx 가져온 사람인가?
 this.address = _saleContractAddress //서명 리플레이 어택 방지
 msg.sender의 잔여구매가능수량
 signature.popcatType 의 판매 가능 수량이 남았는지
 

 검증 완료 시 signature.popcatType민트 (수수료 차감.)