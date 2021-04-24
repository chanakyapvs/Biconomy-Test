import React, { Component } from 'react';


class Main extends Component {

  state = {
    beneficiaryEth: "",
    releaseTimeEth: "",
    amountEth: "",
    beneficiaryTK: "",
    releaseTimeTK: "",
    amountTK: "",
    tokenTK: "",
    tokenAlwa:"",
    tokenAlwc:"",
    tokenABI:[],
    tokenAllow:""
  };


  render() {
    return (
      <div id="content">
        <h6>*Open kovan testnet wallet on metamask</h6>
        <h3>Ether Wallet</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          console.log(this.state.beneficiaryEth)
          console.log(parseInt(this.state.releaseTimeEth))
          console.log(parseInt(this.state.amountEth))		
          this.props.TimelocksEth(this.state.beneficiaryEth, this.state.releaseTimeEth, this.state.amountEth)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="beneficiary"
              type="text"
	      //value = {this.beneficiary=input}		  	
              className="form-control"
              placeholder="Beneficiary Address"
              value={this.state.val}
              onChange={e => this.setState({ beneficiaryEth: e.target.value })}
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="releaseTime"
              type="text"
              value={this.state.val}
              onChange={e => this.setState({ releaseTimeEth: e.target.value })}
              className="form-control"
              placeholder="Release Time"
              required />
          </div>
	  <div className="form-group mr-sm-2">
            <input
              id="amount"
              type="text"
              value={this.state.val}
              onChange={e => this.setState({ amountEth: e.target.value })}
              className="form-control"
              placeholder="Amount"
              required />
          </div>	
          <button type="submit" className="btn btn-primary">Create Wallet</button>
        </form>
        <p>&nbsp;</p>
 <h3>Check Token Allowance</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          console.log(this.state.tokenAlwc) 	
          this.props.allowanceCheck(this.state.tokenAlwc)
        }}>
	  <div className="form-group mr-sm-2">
            <input
              id="token"
              type="text"
	      //value = {this.beneficiary=input}		  	
              className="form-control"
              placeholder="token Address"
              value={this.state.val}
              onChange={e => this.setState({ tokenAlwc: e.target.value })}
              required />
          </div>
          <button type="submit" className="btn btn-primary">Create Wallet</button>
        </form>
        <p>&nbsp;</p>
<h3>Approve Token Allowance</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
           console.log(this.state.tokenABI)	
          this.props.approve(this.state.tokenAlwa, this.state.tokenABI, this.state.tokenAllow)
        }}>
	  <div className="form-group mr-sm-2">
            <input
              id="token"
              type="text"
	      //value = {this.beneficiary=input}		  	
              className="form-control"
              placeholder="token Address"
              value={this.state.val}
              onChange={e => this.setState({ tokenAlwa: e.target.value })}
              required />
          </div>
<div className="form-group mr-sm-2">
            <input
              id="token"
              type="text"
	      //value = {this.beneficiary=input}		  	
              className="form-control"
              placeholder="token ABI"
              value={this.state.val}
              onChange={e => this.setState({ tokenABI: e.target.value })}
              required />
          </div>
<div className="form-group mr-sm-2">
            <input
              id="token"
              type="text"
	      //value = {this.beneficiary=input}		  	
              className="form-control"
              placeholder="token allowance"
              value={this.state.val}
              onChange={e => this.setState({ tokenAllow: e.target.value })}
              required />
          </div>
          <button type="submit" className="btn btn-primary">Create Wallet</button>
        </form>
        <p>&nbsp;</p>
  <h3>Token Wallet</h3>
        <form onSubmit={(event) => {
          event.preventDefault()	
          this.props.TimelocksToken(this.state.tokenTK, this.state.beneficiaryTK, this.state.releaseTimeTK, this.state.amountTK)
        }}>
	  <div className="form-group mr-sm-2">
            <input
              id="token"
              type="text"
              className="form-control"
              placeholder="token Address"
              value={this.state.val}
              onChange={e => this.setState({ tokenTK: e.target.value })}
              required />
          </div>
           <div className="form-group mr-sm-2">
            <input
              id="beneficiary"
              type="text"
              className="form-control"
              placeholder="Beneficiary Address"
              value={this.state.val}
              onChange={e => this.setState({ beneficiaryTK: e.target.value })}
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="releaseTime"
              type="text"
              value={this.state.val}
              onChange={e => this.setState({ releaseTimeTK: e.target.value })}
              className="form-control"
              placeholder="Release Time"
              required />
          </div>
	  <div className="form-group mr-sm-2">
            <input
              id="amount"
              type="text"
              value={this.state.val}
              onChange={e => this.setState({ amountTK: e.target.value })}
              className="form-control"
              placeholder="Amount"
              required />
          </div>	
          <button type="submit" className="btn btn-primary">Create Wallet</button>
        </form>
        <p>&nbsp;</p>
        <h3>Wallets</h3>
        <table className="table">
          <thead>
            <tr>
	      <th scope="col">wallet ID</th>
              <th scope="col">from</th>
              <th scope="col">to</th>
	      <th scope="col">ERC20 Token</th> 	
              <th scope="col">Release Time</th>	
              <th scope="col">Wallet Token Balance</th>
              <th scope="col">Wallet ETH Balance</th>
            </tr>
          </thead>
          <tbody id="walleList">
            { this.props.wallets.map((walle, key) => {
              return(
                <tr key={key}>
		  <td>{walle[6]}</td>
                  <td>{walle[0]}</td>
                  <td>{walle[5]}</td>
                  <td>{walle[4]}</td>
                  <td>{parseInt(walle[1]._hex)}</td>
                  <td>{parseInt(walle[2]._hex)/1000000000000000000}</td>
  		  <td>{parseInt(walle[3]._hex)/1000000000000000000}</td>
                  <td>
                    { !(parseInt(walle[2]._hex) ==0 && parseInt(walle[3]._hex) ==0)
                      ?<button
			  value={parseInt(walle[6])}		
                          onClick={(event) => {
			    console.log(event.target)
                            this.props.release(event.target.value)
                          }}	
                        >
                          Claim
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
