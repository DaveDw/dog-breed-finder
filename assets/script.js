var petFinderapiKey = 'kvthm0Oyqunp3U0nDS5Xv91qQczAhQqUM6xg7fpKf9s97cef4B'
var petFinderSecertapi = 'Ii6bRXzl7o3ZJs3kbf84OyqduNUMaC0E78YsPAdc'


//get - retrieves data
//post - updated,create,delete




var petFinderAccessToken = "";
var timeAccess = null;

// Callback function is only parameter for this async function
function createToken(callBack) {
  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'post',
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: 'grant_type=client_credentials&client_id=' + petFinderapiKey + '&client_secret='+ petFinderSecertapi
  }
  ).then(function (response) {
    return response.json()
  }).then(function (data) {
    petFinderAccessToken = data.petFinderAccessToken;
    timeAccess = new Date();
    callBack()
    // console.log(data.petFinderAccessToken);
  })

}

// Callback function is only parameter for this async function
function runAPICall(callBack) {

  if (timeAccess == null) {
    createToken(callBack);
  }

  else {
    var current = new Date();
    var minsDiff = (current.getTime() - timeAccess.getTime()) / 1000 / 60;
    if (minsDiff > 30) {
      createToken(callBack);
    }
    else {
      callBack()
    }
  }

}

function animalsQuery() {
runAPICall(function( ){
  console.log(petFinderAccessToken)
  fetch ("https://api.petfinder.com/v2/animals", {
    headers: {
      Authorization: "Bearer " + petFinderAccessToken
    }
  }).then(
    function(response){
      return response.json();

    }
  ).then (function(data){
    console.log(data)
  })
})}

fetch ("https://api.thedogapi.com/v1/breeds?limit=10&page=0").then(function(response){
    return response.json();
}).then (function(data){
    console.log(data)
    for (var i = 0; i < data.length; i++) {
        var card = document.createElement("article");

        document.querySelector(".dog-container").appendChild(card)
        
        console.log(data[i].image.url)
    }
})



animalsQuery()