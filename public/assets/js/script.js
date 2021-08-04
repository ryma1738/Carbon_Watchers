
var aviationGlobalEmissions = 943000000;  //943,000,000 Metric Tons, 29.90233 Metric Tons per Second, 0.2990233 every 10ms
var vehicleGlobalEmissions = 6000000000;   //6,000,000,000 Metric Tons, 190.25875 Metric Tons per Second, 1.9025875 every 10ms
var shippingGlobalEmissions = 848000000;   //848,000,000 Metric Tons, 26.88990 Metric tons per Second, 0.2688990 every 10ms
var energyGenerationGlobalEmissions = 33100000000; //33,100,000,000 Metric Tons, 1,049.59411 Metric Tons per Second, 10.4959411 every 10ms
var totalGlobalEmissions = 40891000000 ; //40,891,000,000 Metric Tons, 1,296.64510 Metric Tons per Second, 12.9664510 every 10ms
var currentAviationEmissions = 0;
var currentVehicleEmissions = 0;
var currentShippingEmissions = 0;
var currentEnergyEmissions = 0;
var currentGlobalEmissions = 0;
var currentEmissionsTimer = null;

// const express = require('express');


// let newsKey = '826c8d002dc24d088e02c40677ecd5e5'



function navCLicked(event) {
    // Handles user clicks on a nav bar button
  event.preventDefault();
  var targetId = event.target.getAttribute("id");
  switch (targetId){
    case "title":
      displayNoneAll();
      $("#landing-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
    case "travel-estimates":
      displayNoneAll();
      $("#travel-estimates-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
    case "shipping":
      displayNoneAll();
      $("#shipping-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
    case "global-carbon-emitions":
      displayNoneAll();
      initalizeGlobalEmissions();
      $("#global-carbon-emissions-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
    case "climate-change":
      displayNoneAll();
      $("#climate-change-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
    case "account":
      displayNoneAll();
      $("#account-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
    case "login":
      displayNoneAll();
      $("#login-form").removeClass("d-none");
      $("#footer").addClass("d-none");
      break;
    case "signup":
      displayNoneAll();
      $("#signup-form").removeClass("d-none");
      $("#footer").addClass("");
      break;
    // case "logout":
    //   displayNoneAll();
    //   // $("#about-us-page").removeClass("d-none");
    //   // $("#footer").addClass("");
    //   break;
  }
}

function displayNoneAll() {
  $("#landing-page").addClass("d-none");
  $("#travel-estimates-page").addClass("d-none");
  $("#shipping-page").addClass("d-none");
  $("#global-carbon-emissions-page").addClass("d-none");
  $("#climate-change-page").addClass("d-none");
  $("#about-us-page").addClass("d-none");
  $('#login-form').addClass('d-none');
  $('#signup-form').addClass('d-none');
  $('#account-page').addClass('d-none');
clearInterval(currentEmissionsTimer);
}

function initalizeGlobalEmissions() {
  var today = moment();
  var startOfTheYear = moment("2021-01-01 00:00:00")
  var difference = Math.round(moment.duration(today.diff(startOfTheYear)).as("seconds"));
  currentAviationEmissions = 29.90233 * difference;
  currentVehicleEmissions = 190.25875 * difference;
  currentShippingEmissions = 26.88990 * difference;
  currentEnergyEmissions = 1049.59411 * difference;
  currentGlobalEmissions = 1296.64510 * difference;
  currentEmissionsTimer = setInterval(globalEmissions, 10);
}

function globalEmissions() {
  currentAviationEmissions = Math.round((currentAviationEmissions + 0.2990233) * 100) / 100;
  var tempAviation = Math.round(currentAviationEmissions);
  $("#current-aviation").text(tempAviation.toLocaleString());

  currentVehicleEmissions = Math.round((currentVehicleEmissions + 1.9025875) * 100) / 100;
  var tempVehicles = Math.round(currentVehicleEmissions);
  $("#current-vehicle").text(tempVehicles.toLocaleString());

  currentShippingEmissions = Math.round((currentShippingEmissions + 0.2688990) *100) / 100;
  var tempShipping = Math.round(currentShippingEmissions);
  $("#current-shipping").text(tempShipping.toLocaleString());

  currentEnergyEmissions = Math.round((currentEnergyEmissions + 10.4959411) * 100) / 100;
  var tempEnergy = Math.round(currentEnergyEmissions);
  $("#current-energy").text(tempEnergy.toLocaleString());

  currentGlobalEmissions = Math.round((currentGlobalEmissions + 12.9664510) * 100) / 100;
  var tempGlobal = Math.round(currentGlobalEmissions);
  $("#current-global").text(tempGlobal.toLocaleString());
}

async function loginFormHandler(event) {
  event.preventDefault();
  
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();
  if (email && password) {
    console.log(email, password)
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log('logged in!')
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
}



document.querySelector('#submit-login').addEventListener('submit', loginFormHandler);


//Event Handlers
  $("#header").on("click", navCLicked);


  //Travel Estimates events
  $("#vehicle-btn").on("click", function(event) {
    event.preventDefault();
    $("#vehicle-form").removeClass("d-none");
    $("#flight-form").addClass("d-none");
    $("#img-vehicles").removeClass("d-none");
    $("#img-flight").addClass("d-none");
  });
  $("#flight-btn").on("click", function(event) {
    event.preventDefault();
    $("#vehicle-form").addClass("d-none");
    $("#flight-form").removeClass("d-none");
    $("#img-vehicles").addClass("d-none");
    $("#img-flight").removeClass("d-none");
  });
  // $("#vehicle-form").on("submit", getVehicleMake);
  // $("#flight-form").on("submit", flightFormSubmit);
  // $("#shipping-form").on("submit", shippingFormSubmit);






// Modal 
  var open2 = document.getElementById('open2');
  var modal_container2 = document.getElementById('modal-container2');
  var close2 = document.getElementById('close2');

  open2.addEventListener('click', () => {
    modal_container2.classList.add('show');
  });
  close2.addEventListener('click', () => {
    modal_container2.classList.remove('show');
  });

  // var login = document.getElementById('login');
  // var loginform = document.getElementById('login-form');
  // var loginclose = document.getElementById('closelogin');

  // login.addEventListener('click', () => {
  //   console.log('click');
  //   loginform.classList.remove('d-none');
  // });
  // loginclose.addEventListener('click', () => {
  //   loginform.classList.add('d-none');
  // });



