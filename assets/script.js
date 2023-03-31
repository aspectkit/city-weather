var apiURLCurrent = "https://api.openweathermap.org/data/2.5/forecast?"
var apiURLGeo = "http://api.openweathermap.org/geo/1.0/direct?"
var apikey = "284e017fe4417a22737b6a6dd8129bea"

var searchInput = undefined;
var searchButton = document.getElementById("search-button");
var lat = "";
var lon = "";
var temperature = "";
var wind = "";
var humidity = "";
var icon = "";
var city = "";
var time = "";


// this function times out the script for a specific amount of milliseconds
function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function getCoordinates(){
    var url = apiURLGeo + "q=" + searchInput + "&appid=" + apikey; 
    
    fetch(url)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            lat = data[0].lat;
            lon = data[0].lon;
        });
    
    await delay(2000);
    getCurrentData();
}

function setInfo(cit, temp, hum, wind, icon){
    var cityEl = document.getElementById("city-name");
    time = time.split(" ");
    cityEl.innerHTML = cit + " " + time[0];

    var tempEl = document.getElementById("city-temp");
    tempEl.innerHTML = temp;

    var humEl = document.getElementById("city-humidity");
    humEl.innerHTML = hum;

    var windEl = document.getElementById("city-wind");
    windEl.innerHTML = wind;

    var iconEl = document.getElementById("city-icon");
    var iconUrl = " https://openweathermap.org/img/wn/" + icon + "@2x.png";
    iconEl.setAttribute("src",  iconUrl);
}

function getInput(){
    searchInput = document.getElementById("search-input").value;
    city = searchInput;
    getCoordinates();
}

async function getCurrentData(){
    var url = apiURLCurrent + "lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apikey;
    console.log(url);

    fetch(url)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            temperature = "Temperature: " + data["list"][0]["main"]["temp"] + " degrees F";
            humidity = "Humidity: " + data["list"][0]["main"]["humidity"] + " %"
            wind = "Wind: " + data["list"][0]["wind"]["speed"] + " MPH";
            icon = data["list"][0]["weather"][0]["icon"];
            time = data["list"][0]["dt_txt"];
            console.log(data);
        });

    await delay(1000);
    setInfo(city, temperature, humidity, wind, icon, time);
    createHistoryButton();
}

function createHistoryButton(){
    var parentDivEl = document.getElementById("history");
    var divEl = document.createElement("div");
    var buttonEl = document.createElement("button");

    divEl.setAttribute("class", "col");
    divEl.setAttribute("style", "text-align: center; padding: 10px;");

    buttonEl.setAttribute("type", "button");
    buttonEl.setAttribute("class", "btn btn-primary history-btn");
    buttonEl.innerHTML = city;

    var currentCity = city;
    var currentIcon = icon;
    var currentTemp = temperature;
    var currentHum = humidity;
    var currentWind = wind;
    buttonEl.addEventListener("click", function(){
        setInfo(currentCity, currentTemp, currentHum, currentWind, currentIcon, time);
    });

    divEl.appendChild(buttonEl);
    parentDivEl.appendChild(divEl);
}

searchButton.addEventListener("click", function(){
    getInput();
});