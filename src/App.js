import './App.css';

import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

//import contract from './contractAbi/TODO.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    // reset state, just in case
    setCurrentAccount("");

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);
    
    // a very visible warning if we're not on Rinkeby
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    } 

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        setupEventListener()
    } else {
        console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Make sure you have metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

        // TODO: you might want to add event listeners here
        /*
        connectedContract.on("EventName", () => {
          console.log("Event EventName triggered.")
        });
        */

        console.log("Completed event listener setup")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // TODO: add your contract-specific data & UI elements here
  const renderUI = () => (
    <div>      
      Your wallet is connected! Time to code :)      
    </div>
  )

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderUI()}
        </p>
      </header>
    </div>
  );
}

export default App;
