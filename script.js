const temp = document.getElementById('temp');
const cityLbl = document.getElementById('city');
const highTemp = document.getElementById('temp-hi');
const lowTemp = document.getElementById('temp-low');
const sunUpLbl = document.getElementById('sun-up');
const sunDownLbl = document.getElementById('sun-down');
const weatherLbl = document.getElementById('weather');
const pressureLbl = document.getElementById('pressure')
const dirArrow = document.getElementById('dirArrow');
const windSpeedLbl = document.getElementById('wind-speed');
const forecastUL = document.getElementById('forecast-ul');
const newLoc = document.getElementById('location');
const newLocationBtn = document.getElementById('btn-location');
const currTempDiv = document.getElementById('curr-temp');

let weatherIcon = {
    Cloudy : "/images/clouds.svg",
    Rain: "images/raining.svg",
    Snow : "images/snowy.svg",
    Clear : "images/sunny.svg"
}

let currTempUnit = 'F';
let currTemp;
let currCity;
let currHi;
let currLo;
let sunUp;
let sunDown;
let weather;
let pressure;
let direction;
let windSpeed;
let forecast = [];


function changeTempUnit(type){
    document.getElementById(currTempUnit).classList.remove('btn-selected');
    currTempUnit = type;
    document.getElementById(currTempUnit).classList.add('btn-selected');
    showTemp(); 
    showForecast();
}

function convertTemp(temp){
    if(currTempUnit === "F"){
       return ((temp - 273.15) * 9/5 + 32);
    }else if(currTempUnit === 'C'){
        return (temp - 273.15);
    }else if(currTempUnit === 'K'){
        return (temp);
    }
}

function compassDirection(){
    let directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    let index = (direction + 23)/45;
    return directions[Math.floor(index)];
}

function showTemp(){
    temp.innerHTML = convertTemp(currTemp).toFixed(2) + '\u00B0';
    weatherLbl.innerHTML = weather;
    cityLbl.innerHTML = currCity;
    highTemp.innerHTML= convertTemp(currHi).toFixed(2) + '\u00B0';
    lowTemp.innerHTML = convertTemp(currLo).toFixed(2) + '\u00B0';
    let unixUp = sunUp;
    let dateUP = new Date(unixUp*1000);
    let unixDown = sunDown;
    let dateDown = new Date(unixDown*1000);
    sunUpLbl.innerHTML = "Sunrise: " + dateUP.toLocaleTimeString();
    sunDownLbl.innerHTML = "Sundown: " + dateDown.toLocaleTimeString();
    pressureLbl.innerHTML = "Pressure: " + ((pressure/3386)*100).toFixed(2) + " inHg";
    windSpeedLbl.innerHTML =  `  ${compassDirection()} at ${windSpeed}mph`;
    dirArrow.style.transform = 'rotate(' + (direction-45) + "deg)";
    currTempDiv.style.backgroundImage = "url(" + weatherIcon[weather] + ")";
}

function showForecast(){
    let liTemplate = ["<li class='fc-style bdr-radius color-tile'>" , "</li>"];
    let daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    forecastUL.innerHTML = "";
    for(let i = 0; i < forecast.length; i++){
        let date = new Date(forecast[i].dt*1000);
        forecastUL.innerHTML = forecastUL.innerHTML + liTemplate[0] + daysWeek[date.getDay()] + " " + date.toLocaleTimeString()  + " Temp: " + convertTemp(forecast[i].main.temp).toFixed(2) + '\u00B0' + " - " + forecast[i].weather[0].description + liTemplate[1];
    }
}

function logTempData(tempData){
    console.log(tempData)
    currTemp = tempData.main.temp;
    currHi = tempData.main.temp_max;
    currLo = tempData.main.temp_min;
    currCity = tempData.name;
    sunUp = tempData.sys.sunrise;
    sunDown = tempData.sys.sunset;
    weather = tempData.weather[0].main;
    pressure = tempData.main.pressure;
    direction = tempData.wind.deg;
    windSpeed = tempData.wind.speed;
    showTemp();
}

function logLocationData(){
    
}

function logForecastData(forecastData){
    console.log(forecastData);
    forecast = forecastData.list.reduce((tot, item) => {
        tot.push(item);
        return tot;
    },[]);
    console.log(forecast);
    showForecast();
}

let latitude= 0;
let longitude= 0;

function getLocation() {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
    }else{
      console.log("Geolocation is not supported by this browser.");
    }
  }
 
function getWeatherData(latitude, longitude){
    let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon="+ longitude +"&appid=";

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => logTempData(data));

    let forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon="+ longitude +"&appid=";

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => logForecastData(data));
}
  
function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeatherData(latitude, longitude);
}

function getCoordinates(address){
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+'&key=')
      .then(response => response.json())
      .then(data => {
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;
        getWeatherData(latitude,longitude);
      })
  }

function changeLoc(){
    let newLocation = newLoc.value;
    getCoordinates(newLocation)
    
}


getLocation();



    