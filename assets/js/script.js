var tableBody = document.getElementById("repo-table");
var fetchButton = document.getElementById("fetch-button");

function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  var requestUrl =
    "https://api.guildwars2.com/v2/account/wallet?access_token=3866BD83-5D2B-AA46-8859-518486210B510E1ED7BA-9AE9-49C2-8035-A5B53A93DF06";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data[0].value);
      let requestOtherUrl = `https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=${data[0].value}`;

      fetch(requestOtherUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data1) {
          console.log(data1);
        });
    });
}

fetchButton.addEventListener("click", getApi);

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".dropdown-trigger");
  var instances = M.FormSelect.init(elems, options);
});
