// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./safeerc20.sol";

/**
 * @dev A token holder contract that will allow a beneficiary to extract the
 * tokens after a given release time.
 *
 * Useful for simple vesting schedules like "advisors get all of their tokens
 * after 1 year".
 */
contract Timelock {
    using SafeERC20 for IERC20;

    uint256 public counter = 0;
    
    struct wallet {
        address _provider;
        uint256 _releaseTime;
        uint256 _amountETH;
        uint256 _amountTK;
        address payable _beneficiary;
        IERC20 _token;
    }
    
    mapping(uint256 => wallet) wallets;
    
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
		42, // Kovan
		address(this)
));

    function TimelocksToken(IERC20 token_, address payable beneficiary_, uint256 releaseTime_, uint256 amount_) public returns(uint256){
        // solhint-disable-next-line not-rely-on-time
        require(releaseTime_ > block.timestamp, "TokenTimelock: release time is before current time");
        counter++;
        wallets[counter]._provider = msg.sender;
        wallets[counter]._releaseTime = releaseTime_;
        wallets[counter]._amountTK = amount_;
        wallets[counter]._beneficiary = beneficiary_;
        wallets[counter]._token = token_;
        token_.safeTransferFrom(msg.sender, address(this), amount_);
        return counter;
    }

    function allowanceCheck(IERC20 token_) public view returns(uint256){
        return (token_.allowance(msg.sender,address(this)));
    }
    
    
    function TimelocksEth(address payable beneficiary_, uint256 releaseTime_, uint256 amount_) public payable returns(uint256) {
        require(msg.value == amount_);
         require(releaseTime_ > block.timestamp, "TokenTimelock: release time is before current time");
        counter++;
        wallets[counter]._provider = msg.sender;
        wallets[counter]._releaseTime = releaseTime_;
        wallets[counter]._amountETH = amount_;
        wallets[counter]._beneficiary = beneficiary_;
        return counter;
    }
    
    
    function walletInfo(uint256 walletID) public view returns(address, uint256, uint256, uint256, IERC20, address) {
        return ( wallets[walletID]._provider, wallets[walletID]._releaseTime, wallets[walletID]._amountTK, wallets[walletID]._amountETH, wallets[walletID]._token,wallets[walletID]._beneficiary );
    }
    
    
      function release(uint256 walletID, address userAddress, bytes32 r, bytes32 s, uint8 v) public {
        MetaTransaction memory metaTx = MetaTransaction({
         nonce: nonces[userAddress],
         from: userAddress
         });
    
        bytes32 digest = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(META_TRANSACTION_TYPEHASH, metaTx.nonce, metaTx.from))
        )
        );

        require(userAddress != address(0), "invalid-address-0");
        require(userAddress == ecrecover(digest, v, r, s), "invalid-signatures");  
          
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
    }

}
