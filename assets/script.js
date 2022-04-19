//create click event for the cards to search for available dogs with the petfiinder api
//resize the cards so that the boundaries of the clicks are clear and the images are uniform
//make the page display the results either in an empty tab or in a generated container on the page



var petFinderapiKey = 'kvthm0Oyqunp3U0nDS5Xv91qQczAhQqUM6xg7fpKf9s97cef4B'
var petFinderSecertapi = 'Ii6bRXzl7o3ZJs3kbf84OyqduNUMaC0E78YsPAdc'
var search = document.querySelector("#searchBtn");
var searchInput = document.querySelector('#search')
//get - retrieves data
//post - updated,create,delete




var petFinderAccessToken = "";
var timeAccess = null;
var breedName = ''


function searchText() {
  var breedName = searchInput.trim();
  if (breedName) {
    generateCards(breedName)

    console.log(breedName)
  }
  else {
    alert('Enter Dog breed')
  }
}

// Callback function is only parameter for this async function
function createToken(callBack) {
    fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'post',
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: 'grant_type=client_credentials&client_id=' + petFinderapiKey + '&client_secret=' + petFinderSecertapi
    }
    ).then(function (response) {
        return response.json()
    }).then(function (data) {
      console.log("createToken")
        petFinderAccessToken = data.access_token;
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
    runAPICall(function () {
        console.log(petFinderAccessToken)
        fetch("https://upenn-cors-anywhere.herokuapp.com/https://api.petfinder.com/v2/animals", {
            headers: {
                Authorization: "Bearer " + petFinderAccessToken
            }
        }).then(
            function (response) {
                return response.json();

            }
        ).then(function (data) {
            console.log(data)
        })
    })
}

function generateCards() {

    fetch("https://api.thedogapi.com/v1/breeds?limit=10&page=0").then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        for (var i = 0; i < data.length; i++) {
            var card = document.createElement("article");

            //append breed name (h2)
            var name = data[i].name;
            var nameTag = document.createElement("h2");
            nameTag.textContent = "Breed: " + name;
            card.appendChild(nameTag);

            var url = data[i].image.url;
            var imgTag = document.createElement("img");
            imgTag.setAttribute("src",url);
            card.appendChild(imgTag);
            document.querySelector(".dog-container").appendChild(card);

            //now append height/weight, temperament, and life span (unordered list)
            var list = document.createElement("ul");
            var listItem1 = document.createElement("li");
            var listItem2 = document.createElement("li");
            var listItem3 = document.createElement("li");

            listItem1.textContent = "Life span: " + data[i].life_span;
            listItem2.textContent = "Height: " + data[i].height.imperial + " weight: " + data[i].weight.imperial;
            listItem3.textContent = "temperament: " + data[i].temperament;

            list.appendChild(listItem1);
            list.appendChild(listItem2);
            list.appendChild(listItem3);

            document.querySelector(".dog-container").appendChild(list);


            console.log(data[i].image.url)
        }
    })
}
search.addEventListener("click", generateCards);

//ndjakbdhjkvh

runAPICall(function() {
  animalsQuery()
})