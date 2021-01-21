const temp = document.getElementById('temp');
const cityLbl = document.getElementById('city');
const highTemp = document.getElementById('temp-hi');
const lowTemp = document.getElementById('temp-low');
const sunUpLbl = document.getElementById('sun-up');
const sunDownLbl = document.getElementById('sun-down');

let currTempUnit = 'F';
let currTemp;
let currCity;
let currHi;
let currLo;
let sunUp;
let sunDown;

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

function showTemp(){
    temp.innerHTML = convertTemp(currTemp).toFixed(2) + '\u00B0';
    cityLbl.innerHTML = currCity;
    highTemp.innerHTML= convertTemp(currHi).toFixed(2) + '\u00B0';
    lowTemp.innerHTML = convertTemp(currLo).toFixed(2) + '\u00B0';
    sunUpLbl.innerHTML = sunUp;
    sunDownLbl.innerHTML = sunDown;
}

function logTempData(tempData){
    currTemp = tempData.main.temp;
    currHi = tempData.main.temp_max;
    currLo = tempData.main.temp_min;
    currCity = tempData.name;
    //let d = new Date(tempData.sys.sunrise);
    //console.log(d)
    sunUp = tempData.sys.sunrise;
    sunDown = tempData.sys.sunset;
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



    