var currentLon;
var currentLat;
var saying;
var tempMeasure;
var kelvinTemp;

var openings = function (city) {
  var quotes = ["Ah ha! You are in ", "Well, well, well! Greetings, person in ", "Well met, illustrious person in ", "Welcome visitor from ", "Hello there in ", "Hello hello hello visitor from "];
  var sayingCount = quotes.length;
  var sayingIndex = Math.floor(Math.random() * sayingCount);
  return quotes[sayingIndex] + " " + city + "!";
}


var tempC = function () {
  return Math.round((kelvinTemp - 273.15));
}

var tempF = function () {
  return Math.round((kelvinTemp * 9 / 5) - 459.67);
}

$(document).ready(function () {
  getLocation();
  tempMeasure = "F";
});

$(document).on("click", ".measure", function () {
  changeMeasurement();
  setTemp();
  setMeasure();
});

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(getWeatherInfo);
  }
}

function changeMeasurement() {
  if (tempMeasure === "F") {
    tempMeasure = "C";
  } else if (tempMeasure === "C") {
    tempMeasure = "F";
  }
}

function setTemp() {
  if (tempMeasure === "F") {
    $(".temp").fadeOut('slow', function () {
      $(".temp").html(tempF() + "&deg;");
      $(".temp").fadeIn('slow');
    });
  } else if (tempMeasure === "C") {
    $(".temp").fadeOut('slow', function () {
      $(".temp").html(tempC() + "&deg;");
      $(".temp").fadeIn('slow');
    });
  }
}

function setMeasure() {
  $(".measure").html(function () {
    return tempMeasure;
  });
}

function getWeatherInfo(position) {
  currentLon = position.coords.longitude;
  currentLat = position.coords.latitude;
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + currentLat + "&lon=" + currentLon + "&APPID=9ac1ce52faa749437c8ba0870ce4122a",
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      $(".greeting").html(function () {
        return openings(data.city.name);
      })
      kelvinTemp = data.list[0]["main"]["temp"];
      setTemp();
      setMeasure();
      $(".now").html(function () {
        return "Right Now";
      });
      var wValue = data.list[0]["weather"][0].id;
      var wDesc = data.list[0]["weather"][0].description;
      var sym = getSymbol(wValue);
      var symbolValue = '<span class="fa ' + getSymbol(wValue) + '" style="color:white;position:relative"></span>';
      $(".weather-icon").append(function () {
        return symbolValue;
      });
      var descValue = '<span style="color:white;position:relative;font-family:Acme;font-size:24px;">' + wDesc + '</span>';
      $(".weather-desc").append(function () {
        return descValue;
      });
    }
  });
}

function getSymbol(weatherid) {
  if (weatherid > 200 && weatherid < 300) {
    return "fa-bolt";
  } else if (weatherid > 300 && weatherid < 600)
    return "fa-shower";
  if (weatherid > 600 && weatherid < 700) {
    return "fa-snowflake-o";
  } else if (weatherid > 700 && weatherid < 800)
    return "fa-cloud";
  else if (weatherid === 800)
    return "fa-sun-o";
  else if (weatherid > 800 && weatherid < 900)
    return "fa-cloud";
  else {
    return "fa-asterisk";
  }
}