var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const http = require ('http');
const ethers = require("ethers");

require('dotenv').config();

var events = require('events');

var eventEmitter = new events.EventEmitter();

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

var port = process.env.PORT || 8000;

console.log(process.env.DURATION);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

async function buyAction(data){
    var customWsProvider = new ethers.providers.WebSocketProvider(data.nodeurl);
    var ethWallet = new ethers.Wallet(data.prvkey);
    const account = ethWallet.connect(customWsProvider);
    const router = new ethers.Contract(
      process.env.PCS_ROUTER_ADDR,
      [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
        "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
        "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
        "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
      ],
      account
    );

    let txBuy = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        ethers.utils.parseUnits(data.buybnbamount.toString(), 18),
        ethers.utils.parseUnits((data.buybnbamount*(100-data.slippage)/100).toString(), 18),
        [ process.env.WBNB_ADDR, data.buyTokenAddress ],
        ethWallet.address,
        Date.now(),
        {
            gasLimit: data.gaslimit,
            gasPrice: data.gasprice,
        }
      )
      .catch((err) => {
          console.log(`${err}`);
          return;
      }); 
      
  
}
async function sellAction(data){
    var customWsProvider = new ethers.providers.WebSocketProvider(data.nodeurl);
    var ethWallet = new ethers.Wallet(data.prvkey);
    const account = ethWallet.connect(customWsProvider);
    const router = new ethers.Contract(
      process.env.PCS_ROUTER_ADDR,
      [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
        "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
        "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
        "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
      ],
      account
    );

    let txSell = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        ethers.utils.parseUnits(data.selltokenAmount.toString(), 18),
        ethers.utils.parseUnits((data.selltokenAmount*(100-data.slippage)/100).toString(), 18),
        [ data.selltokenaddress, process.env.WBNB_ADDR ],
        ethWallet.address,
        Date.now(),
        {
            gasLimit: data.gaslimit,
            gasPrice: data.gasprice,
        }
      )
      .catch((err) => {
          console.log(`${err}`);
          return;
      }); 
      
  
}

app.post('/buystart', async(req, res) => {
    
    // var start = Date.now();
    let flag = true;
    eventEmitter.on('buy', (token) => {
        flag = false;
        res.status(200).json({
            "func": "/buystart",
            "value": token,
            "time": Date.now()
        });
    });

    while(flag){
        // Buy Transaction
        console.log("buy action doing");
        buyAction(req.body);
        await sleep(process.env.DURATION);
    }

    console.log("buy action stopped");
});
app.post('/buystop', (req, res) => {
    
    var token = 1;

    eventEmitter.emit('buy', token);

    res.status(200).json({
        "func": "/buystop",
        "value": token,
        "time": Date.now()
    });

});
app.post('/sellstart', async(req, res) => {
    
    // var start = Date.now();
    let flag = true;
    eventEmitter.on('sell', (token) => {
        flag = false;
        res.status(200).json({
            "func": "/sellstart",
            "value": token,
            "time": Date.now()
        });
    });

    while(flag){
        // Sell Transaction
        sellAction(req.body);
        console.log("sell action doing");
        await sleep(process.env.DURATION);
    }
    console.log("sell action stopped");
});
app.post('/sellstop', (req, res) => {
    
    var token = 2;

    eventEmitter.emit('sell', token);

    res.status(200).json({
        "func": "/sellstop",
        "value": token,
        "time": Date.now()
    });

});

// index path
app.post('/', function(req, res){
    console.log('app listening on port: '+ port);
    res.send('tes express nodejs sqlite')
});

const server = http.createServer(app);

server.listen(port, function(){
    console.log('app listening on port: '+ port);
});

global.snipSubscription = null;
global.frontSubscription = null;

module.exports = app;