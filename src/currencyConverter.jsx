import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "../src/assets/logo.jpg";
import { ethers } from "ethers";
import PriceFeed from "../src/artifacts/contracts/HelloWorld.sol/PriceFeed.json";

const CurrencyConverter = () => {
  const [storedPrice, setStoredPrice] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [clickedRadioButtonId, setClickedRadioButtonId] = useState("");
  const [provider, setProvider] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState("");

  const contractAddress = "0xE0E058C78EC9684190d727623D023512Be0D7B8A";

  useEffect(() => {
    async function connectProvider() {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access if needed
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          // Set provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          // Set connected address
          setConnectedAddress(accounts[0]);
        } catch (error) {
          console.error("Error connecting to Ethereum provider:", error);
        }
      }
    }
    connectProvider();
  }, []);

  const handleChange = (e) => {
    setStoredPrice("");
    setSelectedPair(e.target.value);
    setClickedRadioButtonId(e.target.id);
  };

  const handlePairChange = (event) => {
    setSelectedPair(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!provider) {
        console.error("Ethereum provider not connected.");
        return;
      }

      let feedid;
      switch (selectedPair) {
        case "BTC/USD":
          feedid = 1;
          break;
        case "ETH/USD":
          feedid = 2;
          break;
        case "LINK/USD":
          feedid = 3;
          break;
        case "BTC/ETH":
          feedid = 4;
          break;
        default:
          return;
      }

      const signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        PriceFeed.abi,
        signer
      );

      const transaction = await contractWithSigner.updatePrice(feedid);
      await transaction.wait();
      const latestFetchedPrice = await contractWithSigner.getLastFetchedPrice(
        feedid
      );
      setStoredPrice("$" + parseInt(latestFetchedPrice) / 100000000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main">
      <img src={logo} alt="Logo" className="logo" />

      <div className="container">
        <div className="title">
          <h2>Currency Converter</h2>
        </div>
        <div>
          {connectedAddress && <p>Connected Address: {connectedAddress}</p>}
        </div>
        <div className="currency-options">
          <div>
            <input
              type="radio"
              id="btc-usd"
              name="currencyPair"
              value="BTC/USD"
              onChange={handleChange}
            />
            <label htmlFor="btc-usd">BTC/USD</label>
          </div>
          <div>
            <input
              type="radio"
              id="eth-usd"
              name="currencyPair"
              value="ETH/USD"
              onChange={handleChange}
            />
            <label htmlFor="eth-usd">ETH/USD</label>
          </div>
          <div>
            <input
              type="radio"
              id="link-usd"
              name="currencyPair"
              value="LINK/USD"
              onChange={handleChange}
            />
            <label htmlFor="link-usd">LINK/USD</label>
          </div>
          <div>
            <input
              type="radio"
              id="btc-eth"
              name="currencyPair"
              value="BTC/ETH"
              onChange={handleChange}
            />
            <label htmlFor="btc-eth">BTC/ETH</label>
          </div>
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
        <div className="footer">
          {storedPrice !== "" ? (
            <div className="d-flex justify-content-center">
              <h5>
                {selectedPair} ➡ {storedPrice}
              </h5>
            </div>
          ) : (
            <div style={{ height: "20px" }}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
