// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./timerc.sol";

contract Timelock {
    using SafeERC20 for IERC20;
    
    event WalletCreated(uint256 indexed walletID, address indexed beneficiary, uint256 indexed releaseTime);
    event MetaTransactionExecuted(address userAddress, address relayerAddress);

    uint256 public counter;
    
    struct wallet {
        address _provider;
        uint256 _releaseTime;
        uint256 _amountETH;
        uint256 _amountTK;
        address payable _beneficiary;
        IERC20 _token;
    }
    
    mapping(uint256 => wallet) private wallets;
    
    struct EIP712Domain {
    string name;
    string version;
    uint256 chainId;
    address verifyingContract;
    }

    struct MetaTransaction {
        uint256 nonce;
        address from;
    }

    mapping(address => uint256) public nonces;

bytes32 internal constant EIP712_DOMAIN_TYPEHASH = keccak256(bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"));
bytes32 internal constant META_TRANSACTION_TYPEHASH = keccak256(bytes("MetaTransaction(uint256 nonce,address from)"));
bytes32 internal DOMAIN_SEPARATOR = keccak256(abi.encode(
    EIP712_DOMAIN_TYPEHASH,
		keccak256(bytes("Time")),
		keccak256(bytes("2")),
		block.chainid, // Kovan
		address(this)
));
   

    function toTypedMessageHash(bytes32 messageHash) internal view returns(bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, messageHash));
    }

    function TimelocksToken(IERC20 token_, address payable beneficiary_, uint256 releaseTime_, uint256 amount_) external returns(uint256){
        // solhint-disable-next-line not-rely-on-time
        require(releaseTime_ > block.timestamp, "TokenTimelock: release time is before current time");
        counter++;
        wallets[counter]._provider = msg.sender;
        wallets[counter]._releaseTime = releaseTime_;
        wallets[counter]._amountTK = amount_;
        wallets[counter]._beneficiary = beneficiary_;
        wallets[counter]._token = token_;
        token_.safeTransferFrom(msg.sender, address(this), amount_);
        emit WalletCreated(counter, beneficiary_, releaseTime_);
        return counter;
    }
    
    function TopupEth(uint256 walletId, uint256 amount_) external payable {
        require(wallets[walletId]._releaseTime > block.timestamp, "TokenTimelock: release time is before current time");
        require(msg.value == amount_);
        wallets[walletId]._amountETH =  wallets[walletId]._amountETH + msg.value;
    }
    
    function TopupToken(uint256 walletId, IERC20 token_, uint256 amount_) external {
        require(wallets[walletId]._releaseTime > block.timestamp, "TokenTimelock: release time is before current time");
        wallets[walletId]._amountTK =  wallets[walletId]._amountTK + amount_;
        token_.safeTransferFrom(msg.sender, address(this), amount_);
    }
    

    function allowanceCheck(IERC20 token_) external view returns(uint256){
        return (token_.allowance(msg.sender,address(this)));
    }
    
    
    function TimelocksEth(address payable beneficiary_, uint256 releaseTime_, uint256 amount_) external payable returns(uint256) {
        require(msg.value == amount_);
         require(releaseTime_ > block.timestamp, "TokenTimelock: release time is before current time");
        counter++;
        wallets[counter]._provider = msg.sender;
        wallets[counter]._releaseTime = releaseTime_;
        wallets[counter]._amountETH = amount_;
        wallets[counter]._beneficiary = beneficiary_;
        emit WalletCreated(counter, beneficiary_, releaseTime_);
        return counter;
    }
    
    
    function walletInfo(uint256 walletID) external view returns(address, uint256, uint256, uint256, IERC20, address) {
        return ( wallets[walletID]._provider, wallets[walletID]._releaseTime, wallets[walletID]._amountTK, wallets[walletID]._amountETH, wallets[walletID]._token,wallets[walletID]._beneficiary );
    }
    
    
      function release(uint256 walletID, address userAddress, bytes32 sigR, bytes32 sigS, uint8 sigV) external {
       MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress
        });
        require(verify(userAddress, metaTx, sigR, sigS, sigV), "Signer and signature do not match");
        address signers = ecrecover(toTypedMessageHash(hashMetaTransaction(metaTx)), sigV, sigR, sigS);
        require(signers == wallets[walletID]._beneficiary);
        nonces[userAddress] = nonces[userAddress] += 1;
       require(block.timestamp >= wallets[walletID]._releaseTime, "current time is before release time");
       require(walletID<=counter, "wallet does not exist");
       if(wallets[walletID]._amountETH > 0){
       wallets[walletID]._beneficiary.transfer(wallets[walletID]._amountETH);
        wallets[walletID]._amountETH = 0;
       }
       if(wallets[walletID]._amountTK > 0){
        wallets[walletID]._token.safeTransfer(wallets[walletID]._beneficiary, wallets[walletID]._amountTK);
        wallets[walletID]._amountTK = 0;   
       }
       nonces[userAddress]++;
       emit MetaTransactionExecuted(userAddress, msg.sender);
    }
    
    function hashMetaTransaction(MetaTransaction memory metaTx) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            META_TRANSACTION_TYPEHASH,
            metaTx.nonce,
            metaTx.from
        ));
    }
    
    function verify(address user, MetaTransaction memory metaTx, bytes32 sigR, bytes32 sigS, uint8 sigV) internal view returns (bool) {
        address signer = ecrecover(toTypedMessageHash(hashMetaTransaction(metaTx)), sigV, sigR, sigS);
        require(signer != address(0), "Invalid signature");
        return signer == user;
    }

}
