// import logo from './logo.svg';
import './App.css';

import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import CONFIG from './config';

function App() {
  
  const [address, setAddress] = useState("");
  const [pvkey, setPvKey] = useState("");
  const [nodeurl, setNodeURL] = useState("");
  const [slippage, setSlippage] = useState(30);
  const [gasprice, setGasPrice] = useState(40);
  const [gaslimit, setGasLimit] = useState(300000);

  const [buybnbamount, setBuyBNBAmount] = useState(10);
  const [buyTokenAddress, setBuyTokenAddress] = useState("");

  const [selltokenaddress, setSellTokenAddress] = useState("");
  const [selltokendecimal, setSellTokenDecimal] = useState("");
  const [selltokenAmount, setSellTokenAmount] = useState(0);

  const [buyStarted, setBuyStarted] = useState(false);
  const [sellStarted, setSellStarted] = useState(false);

  useEffect(()=>{
  },[address, pvkey, nodeurl, slippage, gasprice, gaslimit, 
    buybnbamount, buyTokenAddress, selltokenaddress, selltokendecimal, selltokenAmount])

  const checkBuyValidate = () => {
    if( address === "" || 
        pvkey === "" ||
        nodeurl === "" ||
        slippage === "" ||
        gasprice === "" ||
        gaslimit === "" ||
        buybnbamount === "" ||
        buyTokenAddress === "") return false;
  }

  const checkSellValidate = () => {
    if( address === "" || 
        pvkey === "" ||
        nodeurl === "" ||
        slippage === "" ||
        gasprice === "" ||
        gaslimit === "" ||
        selltokenAmount === "" ||
        selltokendecimal === "" ||
        selltokenaddress === "") return false;
  }

  const buyStartBtnClicked =  (event) => {
    
    console.log("buy function ");
    if (checkBuyValidate() === false){
      console.log("Invalid params");
      return;
    }

    console.log("ready to send buy start");

    if(buyStarted) { 
      setBuyStarted(false);
      fetch(CONFIG.BACKEND_URL + "/buystop", {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
      }).then((response) => {
        console.log("response" + response);
      }).catch((err) => {
        console.log("error", err);
      })
    }
    else{
      setBuyStarted(true);
      let data ={
        address: address,
        pvkey : pvkey
      }
      
      fetch(CONFIG.BACKEND_URL + "/buystart", {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }).then((response) => {
        console.log("response" + response);
      }).catch((err) => {
        console.log("error", err);
      })
    }
  }

  const sellStartBtnClicked = (event) => {
    if (checkSellValidate() === false){
      console.log("Invalid params");
      return;
    }

    if(sellStarted) { 
      setSellStarted(false);
      fetch(CONFIG.BACKEND_URL + "/sellstop", {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
      }).then((response) => {
        console.log("response" + response);
      }).catch((err) => {
        console.log("error", err);
      })
    }
    else{
      setSellStarted(true);
      let data ={
        address: address,
        pvkey : pvkey
      }
      
      fetch(CONFIG.BACKEND_URL + "/sellstart", {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }).then((response) => {
        console.log("response" + response);
      }).catch((err) => {
        console.log("error", err);
      })
    }

  }

  // Initial
  const addressChanged = (event) =>{
    setAddress(event.target.value);
  }
  const pvkeyChanged = (event) =>{
    setPvKey(event.target.value);
  }
  const nodeurlChanged = (event) =>{
    setNodeURL(event.target.value);
  }
  const slippageChanged = (event) =>{
    setSlippage(event.target.value);
  }
  const gaspriceChanged = (event) =>{
    setGasPrice(event.target.value);
  }
  const gaslimitChanged = (event) =>{
    setGasLimit(event.target.value);
  }
  
  // Buy related
  const buyTokenAddressChanged = (event) =>{
    setBuyTokenAddress(event.target.value);
  }
  const buyBnbAmountChanged = (event) =>{
    setBuyBNBAmount(event.target.value);
  }

  // Sell related
  const sellTokenDecimalChanged = (event) =>{
    setSellTokenDecimal(event.target.value);
  }
  const sellTokenAddressChanged = (event) =>{
    setSellTokenAddress(event.target.value);
  }
  const sellTokenAmountChanged = (event) =>{
    setSellTokenAmount(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div className="Overall">
          <div className="initialSettingDiv">
              <div className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Address"
                  // defaultValue="0x88Db57F51499e24B7d16cc75b697fCe75686f5f5"
                  sx={{ width: 450}}
                  onChange={addressChanged}
                />
              </div>
              <div className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Private Key"
                  // defaultValue=""
                  sx={{ width: 450}}
                  onChange={pvkeyChanged}
                />
                
              </div>
              <div className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Node URL"
                  // defaultValue="https://bsc-dataseed1.binance.org/"
                  sx={{ width: 450}}
                  onChange={nodeurlChanged}
                />
              </div>
              <div  className="initalItemDiv">
                <TextField
                  required
                  id="outlined-required"
                  label="Slippage(%)"
                  // defaultValue="30"
                  sx={{ width: 150}}
                  onChange={slippageChanged}
                />

                <TextField
                  required
                  id="outlined-required"
                  label="Gas Price"
                  // defaultValue="40"
                  sx={{ width: 150}}
                  onChange={gaspriceChanged}
                />
             
                <TextField
                  required
                  id="outlined-required"
                  label="Gas Limit"
                  // defaultValue="300000"
                  sx={{ width: 150}}
                  onChange={gaslimitChanged}
                />
              </div>
          </div>
          <Divider />
          
          <div className="divBuy">
            <div className="divBuyItem">
            <TextField
                required
                id="outlined-required"
                label="BNB Amount"
                // defaultValue="10"
                onChange={buyBnbAmountChanged}
              />
              </div>
              <div className="divBuyItem">
            <TextField
                required
                id="outlined-required"
                label="Token Address"
                // defaultValue="10"
                onChange={buyTokenAddressChanged}
              />
              </div>
              <div>
              <Button variant="contained" onClick={buyStartBtnClicked}>{buyStarted?"Stop":"Start"}</Button>
              </div>
          </div>

          <Divider />
          <div className="divSell">
            <div className="divItemSell">
              <TextField
                required
                id="outlined-required"
                label="Token Address"
                // defaultValue="10"
                onChange={sellTokenAddressChanged}
              />
            </div>
            <div className="divItemSell">
              <TextField
                required
                id="outlined-required"
                label="Token Decimal"
                // defaultValue="18"
                onChange={sellTokenDecimalChanged}
              />
            </div>
            <div className="divItemSell">
              <TextField
                required
                id="outlined-required"
                label="Token Amount"
                // defaultValue="1000"
                onChange={sellTokenAmountChanged}
              /> 
              </div>
              <div>
              <Button variant="contained" onClick={sellStartBtnClicked}>{sellStarted?"Stop":"Start"}</Button>
              </div>
          </div>


        </div>
      </header>
    </div>
  );
}

export default App;
