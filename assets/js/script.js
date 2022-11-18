var tableBody = document.getElementById('repo-table');
var fetchButton = document.getElementById('fetch-button');

function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  var requestUrl = 'https://api.guildwars2.com/v2/account/wallet?access_token=3866BD83-5D2B-AA46-8859-518486210B510E1ED7BA-9AE9-49C2-8035-A5B53A93DF06';
  
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data[0].value)
      let requestOtherUrl = `https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=${data[0].value}`;

    fetch(requestOtherUrl)
    .then(function (response) {
        return response.json();
      })
      .then(function (data1) {
        console.log(data1)
      });
    });

    
}


// fetchButton.addEventListener('click', getApi);




// ------------------- EXCHANGE RATE JS --------------------


// QUERIES----------------------

// GLOBALS----------------------
var currencyNameArray = [];
var currencyRateArray = [];
// This webpage will allow users to select the following 15
// currency options as a base option.
// It is possible to push more to codes to this array if desired
var acceptedCurrencyCodeArray = ["USD", "EUR", "JPY", "GBP", "CNY", 
                               "AUD", "CAD", "CHF", "HKD", "SGD",
                               "SEK", "KRW", "NOK", "NZD", "INR"];
var acceptedCurrencyCodeString = acceptedCurrencyCodeArray.toString();
console.log(acceptedCurrencyCodeString);
// This array will hold the rates corresponding to the 
// acceptedCurrencyCodeArray
var acceptedCurrencyRateArray = [];
// Object will hold the Codes and corresponding Rates
var acceptedCodeRateObject = {};
// initialize baseCurrency with '1' to aide in troubleshooting
// baseCurrency will be USD
var baseCurrency = 1;

var exchangeApiKey = "904542f1d90e49118826f374af1f2cbf";

var exchangeUrl = `https://api.currencyfreaks.com/latest?apikey=${exchangeApiKey}&symbols=${acceptedCurrencyCodeString}`
console.log(exchangeUrl);


// FUNCTIONS--------------------

function getExchangeRate() {
    console.log("here i am!");
    fetch(exchangeUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                  console.log(data);
                  displayRepos(data, user);
                });
              } else {
                alert('Error: ' + response.statusText);
              }
        })

        .then(function (data) {
        console.log(data);
        })
}

getExchangeRate();