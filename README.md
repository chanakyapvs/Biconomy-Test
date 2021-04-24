# Biconomy-Test
Dapp to lock erc20 and ether in smart contract for a period of time

Instructions to install:
1. npm install
2. npm start

Instructions to run:
1. Install metamask in your browser extension
2. open your kovan testnet wallet as smart contract is deployed on kovan
3. you can find your account address on top right corner
4. clicking on the title of the dapp takes you to this code

Form 1: 
A time lock wallet for ETH - 
inputs: To whom you want to send ether, Release time of funds in epoch time, Amount in Wei 
Need to sign on metamask for transaction 

Form 2:
A method to check if you have allowed this wallet to transfer your erc20 tokens
inputs: Your preferred ERC20 token address that is deployed on kovan and whose tokens you want to send to a beneficiary
Popup appears to tell if you have apporved this wallet to transfer funds
pings allowanceCheck function in the smart contract which inturn calls allowance (IERC20 standard) function in that token contract

Form 3: A method to approve funds to transfer for the wallet contract. 
inputs: Your preferred ERC20 token address that is deployed on kovan, ABI of the ERC20  contract, Allowance you want to give for the contract. 
Alternatively you can directly approve erc20 tokens from your token address. 

Form 4:

