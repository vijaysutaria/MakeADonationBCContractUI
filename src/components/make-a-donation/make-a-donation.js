import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import abi from './../../MakeADonation.json';
// const { ethers } = require("ethers");

class MakeADonation extends React.Component {
  contactAddress = "0x20d0A687e4691c8CEA31b1f9018f42b59d3A2445";

  constructor() {
    super();

    this.state = {
      currentAccount: '',
      name: '',
      message: '',
      memos: ''
    }
  }

  async componentDidMount() {
    await this.connectWallet();
    if (await this.isWalletConnected()) {
      await this.getMemos();
    }
  }

  onNameChange(event) {
    this.setState({ 'name': event.target.value });
  }

  onMessageChange(event) {
    this.setState({ 'message': event.target.value });
  }

  onMemoChange() {
    this.setState({ 'memos': "" });
  }

  async onDonate() {
    await this.makeADonation();
  }

  async isWalletConnected() {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log(accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log(account);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please install meta mask");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      this.setState({ 'currentAccount': accounts[0] });
    } catch (error) {
      console.error(error);
    }
  }

  async makeADonation() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please install meta mask");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const makeADonation = new ethers.Contract(this.contactAddress, abi.abi, signer);

      console.log("Making donation");
      const makeADonationTxn = await makeADonation.makeDonation(this.state.name, this.state.message, { value: ethers.utils.formatEther('0.001') });
      await makeADonationTxn.wait();
      console.log("Mined", makeADonationTxn.hash);
      console.log("Donation complete");

      this.setState({ "name": "" });
      this.setState({ "message": "" });

    } catch (error) {
      console.error(error);
    }
  }

  async getMemos() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please install meta mask");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const makeADonation = new ethers.Contract(this.contactAddress, abi.abi, signer);

      console.log("Fetching memos from block chain");
      const memos = await makeADonation.getMemos();
      this.setState({ "memos": memos });
      console.log(memos);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          Please Donate To This Project
        </div>
        <div className='row'>
          <div className='col-2'>
            Your Name :
          </div>
          <div className='col'>
            <input type="text" onChange={this.onNameChange}></input>
          </div>
        </div>
        <div className='row'>
          <div className='col-2'>
            Your Message :
          </div>
          <div className='col'>
            <textarea onChange={this.onMessageChange}></textarea>
          </div>
        </div>
        <div className='row'>
          <div className='col-2'>
            <Button onClick={this.onDonate}>Donate 1 ETH</Button>
          </div>
        </div>
      </div>
    );
  }
}

MakeADonation.propTypes = {};

MakeADonation.defaultProps = {};

export default MakeADonation;