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
Popup appears to tell how much (wei) you have apporved this wallet to transfer funds
pings allowanceCheck function in the smart contract which inturn calls allowance (IERC20 standard) function in that token contract

Form 3: A method to approve funds to transfer for the wallet contract. 
inputs: Your preferred ERC20 token address that is deployed on kovan, ABI of the ERC20  contract, Allowance (wei) you want to give for the contract. 
Alternatively you can directly approve erc20 tokens from your token address. 

Form 4: A method to transfer tokens to this wallet contract
inputs: Your preferred ERC20 token address that is deployed on kovan, To whom you want to send ether, Release time of funds in epoch time, Amount in Wei
Pings TimeLocksToken on this wallet which in turn calls the respective erc20 token address to transfer the tokens to this wallet

Table:
The table shows all the time locked wallets that are in this wallet contract.
The order of listing is wallet ID, who created the wallet, who benefits from the wallet, ERC20 token address(if you are using token wallet, else if shows zero address), Release time in epoch time, wallet's balance in tokens, wallet's balance in ether 
- A claim button is shown if wallet has balance
- Claim button vanishes if tokens/ether was received by beneficiary and if token/ether present in the wallet are zero (when tokens are received by beneficiary, wallet balance becomes zero)

