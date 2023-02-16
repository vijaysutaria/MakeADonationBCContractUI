import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import { Button, Table } from 'react-bootstrap';
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

  onNameChange = (event) => {
    this.setState({ 'name': event.target.value });
  }

  onMessageChange = (event) => {
    this.setState({ 'message': event.target.value });
  }

  onMemoChange = () => {
    this.setState({ 'memos': "" });
  }

  onDonate = async () => {
    await this.makeADonation();
  }

  async isWalletConnected() {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0;
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
      const makeADonationTxn = await makeADonation.makeDonation(this.state.name, this.state.message, { value: ethers.utils.parseEther('0.0001') });
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
    const { memos } = this.state;
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
            <Button onClick={this.onDonate}>Donate 0.0001 ETH</Button>
          </div>
        </div>
        <div className='row'>
          <div className="col"></div>
        </div>
        <div className='row'>
          <div className="col"></div>
        </div>
        {memos && memos.length && (
          <div className="row">
            <div className='row'>
              <div className="col">
                Past donations by different donators :
              </div>
            </div>
            <div className='row'>
              <div className="col">
                <Table>
                  <tr>
                    <th>Name</th>
                    <th>Message</th>
                    <th>Timestamp</th>
                    <th>Sender Address</th>
                  </tr>
                  {memos.map((memo) => (
                    <tr>
                      <td>{memo.name}</td>
                      <td>{memo.message}</td>
                      <td>{memo.timestamp.toNumber()}</td>
                      <td>{memo.from}</td>
                    </tr>
                  ))
                  }
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

MakeADonation.propTypes = {};

MakeADonation.defaultProps = {};

export default MakeADonation;