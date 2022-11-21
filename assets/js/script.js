let enterEl = document.getElementById('enter-button');
let apiFieldEl = document.getElementById('api-key');
let goldFieldEl = document.getElementById('gold');
let gemsFieldEl = document.getElementById('gems');
let usdFieldEl = document.getElementById('usd');


let gwApiKey = '';
// Testing API Key: 3866BD83-5D2B-AA46-8859-518486210B510E1ED7BA-9AE9-49C2-8035-A5B53A93DF06 | 6A8C3A68-7264-054E-8E91-6E368B2C223B803FA554-3434-402A-B047-C8657E85F416
let usdValue = '';

function getApi(key) {
  let requestUrl = `https://api.guildwars2.com/v2/account/wallet?access_token=${key}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log(data[0].value);
      goldFieldEl.textContent = data[0].value
      let requestOtherUrl = `https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=${data[0].value}`;

      fetch(requestOtherUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data1) {
          //console.log(data1.quantity);
          gemsFieldEl.textContent = data1.quantity
          usdValue = Math.round(data1.quantity * 0.0125 * 100) / 100;
          //console.log(`$${parseFloat(usdValue).toFixed(2)}`);
          usdFieldEl.textContent = `$${parseFloat(usdValue).toFixed(2)}`
        });
    });


}

// ------------------- EXCHANGE RATE JS --------------------

// QUERIES----------------------

// GLOBALS----------------------
var currencyNameArray = [];
var currencyRateArray = [];
// This webpage will allow users to select the following 15
// currency options as a base option.
// It is possible to push more to codes to this array if desired
var acceptedCurrencyCodeArray = ["MXN", "EUR", "JPY", "GBP", "CNY", 
                               "AUD", "CAD", "CHF", "HKD", "SGD",
                               "SEK", "KRW", "NOK", "NZD", "INR"];
var acceptedCurrencyCodeString = acceptedCurrencyCodeArray.toString();
console.log(acceptedCurrencyCodeString);
// This array will hold the rates corresponding to the
// acceptedCurrencyCodeArray
var acceptedCurrencyRateArray = [];
// Object will hold the Codes and corresponding Rates
var acceptedCodeRateObject = {};
// baseCurrency will be USD
var baseCurrency = "USD";

var exchangeApiKey = "904542f1d90e49118826f374af1f2cbf";

var exchangeUrl = `https://api.currencyfreaks.com/latest?apikey=${exchangeApiKey}&symbols=${acceptedCurrencyCodeString}`;
console.log(exchangeUrl);

// FUNCTIONS--------------------

function init() {
    // retrieve latest data from exchange rate API
    getExchangeRate();

}

var getExchangeRate = function() {

    fetch(exchangeUrl)
        .then(function (response) {
            // check that code is viable
            // store data from API into global object
            if (response.ok) {
                console.log(response);
                myData = response.json();
                myData.then(function (data) {
                    console.log("print full object of objects", data);
                    // stores the object 'rates' from the data response into
                    // global variable object
                    acceptedCodeRateObject = data.rates;
                    console.log("print rates", acceptedCodeRateObject);

                    // Dynamically create dropdown to select currency
                    var myOptions = acceptedCodeRateObject;
                    var mySelect = $('#my-currency');
                    // for each key-value (myCountryCode-myExchangeRate) pair
                    // append the country code as an option in the drop down
                    // use the exchange rate to perform operation to convert data
                    $.each(myOptions, function(myCountryCode, myExchangeRate) {
                        mySelect.append($('<option></option>').val(myCountryCode).html(myCountryCode));
                        acceptedCurrencyRateArray.push(myExchangeRate)
                        // TO-DO: ARITHMETIC FOR EXCHANGE RATE BASED ON COUNTRY SELECTION
                        // if any of the country codes are selected (this forces user to
                        // make code selection instead of leaving placeholder as dropdown
                        // option) thenuse the corresponding value to perform exchange rate
                        if (myCountryCode) {
                            // TO-DO: MATH
                            console.log("DO MAFFS HERE");
                        }
                    });
                });
              } else {
                alert('Error: ' + response.statusText);
              }

        });
}

// EVENT HANDLERS-----------------------------------

let formSubmitHandler = function (event) {
  event.preventDefault();

  let api = apiFieldEl.value.trim();

  if (api) {
    gwApiKey = api
    getApi(gwApiKey)
  } else {
    alert('Please enter a valid Guild Wars 2 API Key');
  }
};

enterEl.addEventListener('click', formSubmitHandler);

// RUN PROGRAM--------------------------------------
init();

