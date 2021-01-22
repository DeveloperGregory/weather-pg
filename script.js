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

function changeTempUnit(type){
    document.getElementById(currTempUnit).classList.remove('btn-selected');
    currTempUnit = type;
    document.getElementById(currTempUnit).classList.add('btn-selected');
    showTemp(); 
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
    windSpeedLbl.innerHTML =  `${compassDirection()} at ${windSpeed}mph`;
    dirArrow.style.transform = 'rotate(' + (direction-45) + "deg)";
    
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

let latitude= 0;
let longitude= 0;

function getLocation() {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
    }else{
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon="+ longitude +"&appid=";

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => logTempData(data));
}

getLocation();



    