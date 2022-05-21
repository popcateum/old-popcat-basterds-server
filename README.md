# old-popcat-bastards-server
OPB Gasless WL server

### [GET] 참여자격 조회  
- /whitelist/check?address=`EOA 지갑주소`
```
[200]
{
    address:EOA지갑주소,
    first_tx_hash : 0xaa..,
    first_tx_time : 2017-05-20 19:13:49,
    first_tx_block : 12345
}
   
```

### [GET] 화이트리스트 참여 티켓 획득
- /whitelist/ticket?address=`EOA 지갑주소`
- 서명구조 : [address, year, contract_address]
```
[200]
{
    address : EOA지갑주소,
    year : 2017,
    contract_address : 세일계약주소
    ticket_hash : 서명된해시값,
    ticket_signature : 서명
}
```
### 공통에러
```
[400]
{   
    message:"Invalid address."
}

[401]
{   
    message:"Not whitelisted"
}
   
```

   



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