// HTML element declarations
const enterEl = document.getElementById("enter-button");
const apiFieldEl = document.getElementById("api-key");
const goldFieldEl = document.getElementById("gold");
const gemsFieldEl = document.getElementById("gems");
const usdFieldEl = document.getElementById("usd");
const currencyFieldEl = document.getElementById("my-currency");
let currencyHistory = [];

// Testing API Keys: 3866BD83-5D2B-AA46-8859-518486210B510E1ED7BA-9AE9-49C2-8035-A5B53A93DF06 | 6A8C3A68-7264-054E-8E91-6E368B2C223B803FA554-3434-402A-B047-C8657E85F416

// ------------------- GW2 API JS --------------------

// GLOBALS----------------------
let gwApiKey = "";
let usdValue = "";
let newUsdValue = "";

// FUNCTIONS--------------------

// Pulls GW2 API data
function getApi(key) {
  // Looks up entered key account's gold value
  let requestUrl = `https://api.guildwars2.com/v2/account/wallet?access_token=${key}`;

  fetch(requestUrl)
    .then(function (response) {
      if (!response.ok) {
        // if the response is not 'ok', display to user in modal
        modalText.textContent = "Error: " + response.statusText;
        modal.style.display = "block";
      }
      return response.json();
    })
    .then(function (data) {
      //console.log(data[0].value);
      // Pulls the value of the entered key account's gold value
      goldFieldEl.textContent = data[0].value;
      // Looks up entered GW2's global gold to gem conversion rate, based on amount of gold from previous input
      let requestOtherUrl = `https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=${data[0].value}`;

      fetch(requestOtherUrl)
        .then(function (response) {
          if (!response.ok) {
            modal.append($("<p></p>").html("Error: " + response.statusText));
            modal.style.display = "block";
          }
          return response.json();
        })
        .then(function (data1) {
          //console.log(data1.quantity);
          // Pulls the amount of gems the entered key account's gold converts into
          gemsFieldEl.textContent = data1.quantity;
          // Converts account's gem value into USD based on a non-fluctuating amount at a rate of 1 Gem = .0125 Cents
          usdValue = Math.round(data1.quantity * 0.0125 * 100) / 100;
          //console.log(`$${parseFloat(usdValue).toFixed(2)}`);
          // Adjusts USD value to present it in a ledgeable format, aka 2 decimal cents and all dollars
          newUsdValue = parseFloat(usdValue).toFixed(2);
          // Further adjusts displayed USD to include "$" sign, then displays it
          let displayUsdValue = `$${newUsdValue}`;
          usdFieldEl.textContent = displayUsdValue;
          currencyExchange();
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
var acceptedCurrencyCodeArray = [
  "MXN",
  "EUR",
  "JPY",
  "GBP",
  "CNY",
  "AUD",
  "CAD",
  "CHF",
  "HKD",
  "SGD",
  "SEK",
  "KRW",
  "NOK",
  "NZD",
  "INR",
];
var acceptedCurrencyCodeString = acceptedCurrencyCodeArray.toString();
// console.log(acceptedCurrencyCodeString);
// This array will hold the rates corresponding to the
// acceptedCurrencyCodeArray
var acceptedCurrencyRateArray = [];
// Object will hold the Codes and corresponding Rates
var acceptedCodeRateObject = {};
// baseCurrency will be USD
var baseCurrency = "USD";

var exchangeApiKey = "904542f1d90e49118826f374af1f2cbf";

var exchangeUrl = `https://api.currencyfreaks.com/latest?apikey=${exchangeApiKey}&symbols=${acceptedCurrencyCodeString}`;
// console.log(exchangeUrl);

// FUNCTIONS--------------------

function init() {
  // retrieve latest data from exchange rate API

  getExchangeRate();

  // Getting the currency history array from the localstoragee
  let history = localStorage.getItem("currency-history");
  if (history != null) {
    currencyHistory = JSON.parse(history);
  }
  // Calling the function to show buttons
  getHistoryButtons();
}

let buttonsContainer = $("#history-buttons");
function getHistoryButtons() {
  for (
    let i = 0;
    currencyHistory.length < 3 ? i < currencyHistory.length : i < 3;
    i++
  ) {
    let divEl = $("<div>");
    // <div class="col s2 btn-container">
    divEl.attr("class", "row s2 btn-container");

    // <a id="enter-button" class="waves-effect waves-light btn"
    let btnEl = $("<a>").text(currencyHistory[i]);

    btnEl.attr("class", "waves-effect waves-light btn");

    if (currencyHistory[0]) {
      divEl.append(btnEl);
      buttonsContainer.append(divEl);
    }
  }
}

var getExchangeRate = function () {
  fetch(exchangeUrl).then(function (response) {
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
        i = 0;

        // Dynamically create dropdown to select currency
        var myOptions = acceptedCodeRateObject;
        var mySelect = $("#my-currency");
        // for each key-value (myCountryCode-myExchangeRate) pair
        // append the country code as an option in the drop down
        // use the exchange rate to perform operation to convert data
        $.each(myOptions, function (myCountryCode, myExchangeRate) {
          mySelect.append(
            $(`<option data-name="${i++}"></option>`)
              .val(myCountryCode)
              .html(myCountryCode)
          );
          acceptedCurrencyRateArray.push(myExchangeRate);
        });
      });
    } else {
      //TODO: Alert needs to be removed
      modal.append($("<p></p>").html("Error: " + response.statusText));
      modal.style.display = "block";
    }
  });
};

var currencyExchange = function () {
  const currencyTitle = $("#extra-currency");
  // Checks if an optional currency is used to convert after USD is established
  if (acceptedCurrencyCodeArray.includes(currencyFieldEl.value)) {
    // Checks for a specified currencies dataset value
    let rateValue = currencyFieldEl.selectedOptions[0].dataset.name;
    // Displays output for optional currency conversion
    $(".usd-card").removeClass("hide");
    currencyTitle[0].textContent = currencyFieldEl.value;
    // Uses currency dataset value to multiply USD value with currency exchange rates
    currencyTitle.append(
      $("<p></p>").html(
        parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(
          2
        )
      )
    );
  }
};

/* ---------------------- MODALS ----------------------- */

// Get the modal main div
var modal = document.getElementById("my-modal");
// Get the modal div that will display the error text to user
var modalAlert = document.getElementById("modal-alert");
// create a <p> element in html, give it an ID, determine text content
// append the text to the modalAlert div
var modalText = document.createElement("p");
modalText.setAttribute("id", "modal-text");
modalText.textContent = "Please enter a valid 72 digit Guild Wars 2 API Key";
modalAlert.append(modalText);

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// EVENT HANDLERS-----------------------------------

let formSubmitHandler = function (event) {
  event.preventDefault();

  // Trims API input, then converts and pushes it to an array for verifacation
  let api = apiFieldEl.value.trim();
  let apiArray = [];
  apiArray.push(api.split(""));
  // Checks if an API Key that is entered is of a valid length
  if (apiArray[0].length === 72) {
    $(".usd-card").removeClass("hide");
    gwApiKey = api;
    // Runs the GW2 API function on the entered API key
    getApi(gwApiKey);
  } else {
    // Created <p> element to alert user to enter a valid key
    modal.append(
      $("<p></p>").html("Please enter a valid 72 digit Guild Wars 2 API Key")
    );
    modal.style.display = "block";

    // updating the current history array to the new selected currency

    let selectedCurrency = $("#my-currency").val();
    currencyHistory.unshift(selectedCurrency);
    localStorage.setItem("currency-history", JSON.stringify(currencyHistory));
  }
};

enterEl.addEventListener("click", formSubmitHandler);

// RUN PROGRAM--------------------------------------
init();
