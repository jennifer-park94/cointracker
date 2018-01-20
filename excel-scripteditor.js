// Crypto Investment Tracker
const queryString = Math.random(); 
const ss = SpreadsheetApp.getActiveSpreadsheet(); 

// Rates 

const ssRates = ss.getSheetByName('Rates'); 

// Wallet Balance 

//const ssWallets = ss.getSheetByName('Wallets'); 
//const bchWallet = getBchBalance("Your BCH Address"); 


// const ethApiKey = "Etherscan API key"
// const ethWallet = getEthBalance(ethApiKey,"ETH Address");
// ss.Wallets.getRange('B4').setValue(ethWallet); 

// Set Target Currency 

const targetCurrency = 'usd'

// Grabs CoinMarketCap data 
if (typeof targetCurrency == 'undefined' || targetCurrency == '') {targetCurrency = 'usd'}; 
var coins = getCoins(); 

function getData() { 

	var myCoins = [ 
	'bitcoin', 
	'bitcoin-cash', 
	'ethereum']

	ssRates.getRange('A1').setValue("ID");
  	ssRates.getRange('B1').setValue("Name");
  	ssRates.getRange('C1').setValue("Symbol");
	ssRates.getRange('D1').setValue("Price USD");
  	ssRates.getRange('E1').setValue("Price BTC");
  	ssRates.getRange('F1').setValue("24H Volume USD");
  	ssRates.getRange('G1').setValue("Market Cap USD");
  	ssRates.getRange('H1').setValue("Available Supply");
  	ssRates.getRange('I1').setValue("Total Supply");
  	ssRates.getRange('J1').setValue("Max Supply");
  	ssRates.getRange('K1').setValue("Percent Change 1H");
  	ssRates.getRange('L1').setValue("Percent Change 24H ");
  	ssRates.getRange('M1').setValue("Percent Change 7D");
  	ssRates.getRange('N1').setValue("Last Updated");

  // Adds in extra column headers if non-USD currency was chosen
  	if (targetCurrency !== 'usd') {
   	 ssRates.getRange('O1').setValue("Price " + targetCurrency.toUpperCase());
     ssRates.getRange('P1').setValue("24H Volume " + targetCurrency.toUpperCase());
     ssRates.getRange('Q1').setValue("Market Cap " + targetCurrency.toUpperCase());
  	};

  	var myCoinsObj = {};
  	var myCoinsCount = myCoins.length;
  		for (var i = 0; i < myCoinsCount; i++) {
    var c = i+2;
    var n = 0;
    	while (coins[n]['id'] !== myCoins[i]) {
      	n++;
    }

    myCoinsObj[coins[n]['id']] = coins[n];

    ssRates.getRange('A'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['id']);
    ssRates.getRange('B'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['name']);
    ssRates.getRange('C'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['symbol']);
    ssRates.getRange('D'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['price_usd']);
    ssRates.getRange('E'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['price_btc']);
    ssRates.getRange('F'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['24h_volume_usd']);
    ssRates.getRange('G'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['market_cap_usd']);
    ssRates.getRange('H'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['available_supply']);
    ssRates.getRange('I'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['total_supply']);
    ssRates.getRange('J'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['max_supply']);
    ssRates.getRange('K'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['percent_change_1h']);
    ssRates.getRange('L'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['percent_change_24h']);
    ssRates.getRange('M'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['percent_change_7d']);
    ssRates.getRange('N'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['last_updated']);
    if (targetCurrency !== 'usd') {
      ssRates.getRange('O'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['price_' + targetCurrency]);
      ssRates.getRange('P'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['24h_volume_' + targetCurrency]);
      ssRates.getRange('Q'+(c).toString()).setValue(myCoinsObj[myCoins[i]]['market_cap_' + targetCurrency]);
};
}

function getCoins() { 
	var url = 'https://api.coinmarketcap.com/v1/ticker/?limit=0&convert='+targetCurrency;
	var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true}); 
	var balance = response.getContextText();
	Utilities.sleep(300);

	return balance * Math.pow(10,-8);
}

function getBtcBalance(btcAddress) { 

  var url = 'https://blockexplorer.com/api/addr/'+btcAddress+'/balance';
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var balance = response.getContentText();
  //Pause to not trigger API limit for multiple wallets
  Utilities.sleep(300);
    
  return balance * Math.pow(10,-8);
}

function getEthBalance(ethApiKey,ethAddress) { 
	var url = 'https://api.etherscan.io/api?module=account&action=balance&address='+ethAddress+'&tag=latest&apikey='+ethApiKey;
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  var obj = JSON.parse(json);
  var balance = obj.result;
  //Pause to not trigger API limit for multiple wallets
  Utilities.sleep(300);
    
  return balance * Math.pow(10,-18);
}
