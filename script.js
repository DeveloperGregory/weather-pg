const temp = document.getElementById('temp');
let currTempUnit = 'F';
let currTemp;

function changeTempUnit(type){
    document.getElementById(currTempUnit).classList.remove('btn-selected');
    currTempUnit = type;
    document.getElementById(currTempUnit).classList.add('btn-selected');
    showTemp(); 
}

function convertTemp(){
    if(currTempUnit === "F"){
       return ((currTemp - 273.15) * 9/5 + 32);
    }else if(currTempUnit === 'C'){
        return (currTemp - 273.15);
    }else if(currTempUnit === 'K'){
        return (currTemp);
    }
}

function showTemp(){
    temp.innerHTML = convertTemp().toFixed(2) + '\u00B0';
}

function logTempData(tempData){
    currTemp = tempData.temp;
    showTemp();
}

fetch("http://api.openweathermap.org/data/2.5/weather?q=bloomington,indiana&appid={}")
    .then(response => response.json())
    .then(data => logTempData(data.main));

    