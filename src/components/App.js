import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Timelock from '../abis/timelock.json'
import lock from '../abis/lock.json'
import Navbar from './Navbar'
import Main from './Main'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Biconomy from "@biconomy/mexa";


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadBiconomy()
  }

  async loadBiconomy() {
       //let web4
	const biconomy = new Biconomy(window.ethereum, {apiKey: "q7DL9bFBk.8f0ce299-32d6-4b39-ab04-3508f0faac96", debug: true});
	const web4 = new Web3(biconomy);
        biconomy.onEvent(biconomy.READY, async () => {
      // Initialize your dapp here like getting user accounts etc

      await window.ethereum.enable();	
    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error)
    });
}

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    if(networkId != 42){
      window.alert("Select kovan network wallet on metamask")
    }
    //const networkData = Marketplace.networks[networkId]
    if(true) {
      console.log("asfa")
      const times = web3.eth.Contract(lock, "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2");
      const counters = await times.methods.counter().call()
      console.log(counters)
      for (var i = 1; i <= counters; i++) {
        const wallet = await times.methods.walletInfo(i).call()
        await times.events.MetaTransactionExecuted({
          fromBlock: 0
      }, function(error, event){ console.log(event); })
      .on('data', function(event){
          console.log(event); // same results as the optional callback above
      })
	console.log(wallet)
	wallet[6] = i
	//console.log(wallet)	
        this.setState({
          wallets: [...this.state.wallets, wallet]
        })
      }	
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      wallets: [],
      loading: true,
      token: '',
      balance: 0,
      beneficiary: '',
      provider: '',
      contract:	'',
      decimals: 0
    }

    this.release = this.release.bind(this)
    this.TimelocksEth = this.TimelocksEth.bind(this)
    this.TimelocksToken = this.TimelocksToken.bind(this)
    this.allowanceCheck = this.allowanceCheck.bind(this)
    this.approve = this.approve.bind(this)
  }

 
  TimelocksEth(beneficiary, releaseTime, amount) {
    const web3 = window.web3
    const times = web3.eth.Contract(lock, "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2");
    amount = web3.utils.toWei(amount.toString(), 'ether')
    times.methods.TimelocksEth(beneficiary, releaseTime, amount).send({ from: this.state.account, value: amount })
    .once('receipt', (receipt) => {
      window.alert("successful")
    })
  }
 
 async approve(token, amount) {
    const web3 = window.web3
    //abi = JSON.parse(abi)
    //console.log(abi)
    console.log(token)
    console.log(amount)
    const AbiDecimal = [{
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }]
    const tokenContract = web3.eth.Contract(AbiDecimal, token);
    console.log(tokenContract)
    const decimals = await tokenContract.methods.decimals().call({from: this.state.account})
    const abiApprove = [{
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }] 
    const times = web3.eth.Contract(abiApprove, token);
    amount = web3.utils.toBN(amount).mul(web3.utils.toBN((10**decimals))).toString();
    times.methods.approve("0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2",amount).send({ from: this.state.account})
    .once('receipt', (receipt) => {
    })
  }

 async allowanceCheck(token) {
    const web3 = window.web3
    console.log((token).toString())
    const times = web3.eth.Contract(lock, "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2");
    const AbiDecimal = [{
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }]
    const tokenContract = web3.eth.Contract(AbiDecimal, token);
    console.log(tokenContract)
    const decimals = await tokenContract.methods.decimals().call({from: this.state.account})
    var allowance = await times.methods.allowanceCheck(token).call({from: this.state.account})
    console.log((allowance))
    allowance = web3.utils.toBN(allowance).div(web3.utils.toBN((10**decimals))).toString();
    window.alert("User already gave allowance of  " + allowance + " tokens from  " + token + " with decimals " + decimals + "  to the wallet")
  }

 async TimelocksToken(token, beneficiary, releaseTime, amount) {
    const web3 = window.web3
    const AbiDecimal = [{
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }]
    const times = web3.eth.Contract(lock, "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2");
    const tokenContract = web3.eth.Contract(AbiDecimal, token);
    console.log(tokenContract)
    const decimals = await tokenContract.methods.decimals().call({from: this.state.account})
    amount = web3.utils.toBN(amount).mul(web3.utils.toBN((10**decimals))).toString();
    console.log(amount)
    times.methods.TimelocksToken(token, beneficiary, releaseTime, amount).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log(receipt);
    }).then(function(receipt){
      console.log(receipt);
  });
  }



    async release(walletID) {
    const domainData = {
  		name: "Time",
  		version: "2",
  		chainId: "42",  // Kovan
  		verifyingContract: "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2"
		};
	const domainType = [
  		{ name: "name", type: "string" },
  		{ name: "version", type: "string" },
  		{ name: "chainId", type: "uint256" },
  		{ name: "verifyingContract", type: "address" }
		];

	const metaTransactionType = [
  		{ name: "nonce", type: "uint256" },
  		{ name: "from", type: "address" }
		];	

    console.log(window.ethereum.selectedAddress)
    console.log(walletID)
    const biconomy = new Biconomy(window.ethereum, {apiKey: "zDe7Syat7.a987ecae-2631-42e8-8b4d-fccbbb8023ea", debug: true});
	const web4 = new Web3(biconomy);
	console.log(web4)
	const contract = new web4.eth.Contract(lock, "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2");
        const nonce = await contract.methods.nonces(window.ethereum.selectedAddress).call();
        biconomy.onEvent(biconomy.READY, async () => {
      await window.ethereum.enable();
      const contract = new web4.eth.Contract(lock, "0x551F5A0AB7C084ae825cB8bD4Ef22148Ae4c26c2");
    }).onEvent(biconomy.ERROR, (error, message) => {
      console.log(error)
    });
    let message = {};
    message.nonce = parseInt(nonce);
    message.from = window.ethereum.selectedAddress;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message
    });

     window.ethereum.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [window.ethereum.selectedAddress, dataToSign]
      },
      async function (err, result) {
        if (err) {
          return console.error(err);
        }
        console.log("Signature result from wallet :");
        console.log(result);
        if(result && result.result) {
          const signature = result.result.substring(2);
          const r = "0x" + signature.substring(0, 64);
          const s = "0x" + signature.substring(64, 128);
          const v = parseInt(signature.substring(128, 130), 16);
          console.log(r, "r")
          console.log(s, "s")
          console.log(v, "v")
          console.log(window.ethereum.selectedAddress, "userAddress")
          console.log(contract.methods) 
          const meta = await contract.methods
            .release(walletID, window.ethereum.selectedAddress, r, s, v)
            .send({
              from: window.ethereum.selectedAddress
            }).once('transactionHash', function(hash){ console.log(hash) }).on('confirmation', function(confNumber, receipt, latestBlockHash){console.log("confirmed"); window.alert("successful meta-transaction of wallet ID" + walletID ) })
            .on('error', function(error){ console.log(error) })
        } else {
        }
      }
    );
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { 
                <Main
                  approve = {this.approve}
                  allowanceCheck = {this.allowanceCheck}
 		  TimelocksEth = {this.TimelocksEth}
		  TimelocksToken = {this.TimelocksToken}
		  wallets = {this.state.wallets}	
                   provider = {this.state.provider} release={this.release}
       			token = {this.state.token} balance = {this.state.balance} beneficiary={this.state.beneficiary}  />              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
