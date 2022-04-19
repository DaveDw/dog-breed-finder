//create click event for the cards to search for available dogs with the petfiinder api
//resize the cards so that the boundaries of the clicks are clear and the images are uniform
//make the page display the results either in an empty tab or in a generated container on the page
//change click event to submit and make the search bar clear itself



var petFinderapiKey = 'kvthm0Oyqunp3U0nDS5Xv91qQczAhQqUM6xg7fpKf9s97cef4B'
var petFinderSecertapi = 'Ii6bRXzl7o3ZJs3kbf84OyqduNUMaC0E78YsPAdc'
var search = document.querySelector("#searchBtn");

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
    var textInput = document.querySelector("#search");
    var imgurlStart = "https://cdn2.thedogapi.com/images/"
    var imgurlEnd = ".jpg"
    fetch("https://api.thedogapi.com/v1/breeds/search?q=" + textInput.value).then(function (response) {
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

            //append image
            if (data[i].reference_image_id) {
                var url = imgurlStart + data[i].reference_image_id + imgurlEnd;
                var imgTag = document.createElement("img");
                imgTag.setAttribute("src", url);
                card.appendChild(imgTag);
            }

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

            card.appendChild(list);
            document.querySelector(".dog-container").appendChild(card);


        }
    })
}
search.addEventListener("click", generateCards);

//ndjakbdhjkvh

runAPICall(function() {
  animalsQuery()
})
