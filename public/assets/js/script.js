
const aviationGlobalEmissions = 943000000;  //943,000,000 Metric Tons, 29.90233 Metric Tons per Second, 0.2990233 every 10ms
const vehicleGlobalEmissions = 6000000000;   //6,000,000,000 Metric Tons, 190.25875 Metric Tons per Second, 1.9025875 every 10ms
const shippingGlobalEmissions = 848000000;   //848,000,000 Metric Tons, 26.88990 Metric tons per Second, 0.2688990 every 10ms
const energyGenerationGlobalEmissions = 33100000000; //33,100,000,000 Metric Tons, 1,049.59411 Metric Tons per Second, 10.4959411 every 10ms
const totalGlobalEmissions = 40891000000 ; //40,891,000,000 Metric Tons, 1,296.64510 Metric Tons per Second, 12.9664510 every 10ms
var currentAviationEmissions = 0;
var currentVehicleEmissions = 0;
var currentShippingEmissions = 0;
var currentEnergyEmissions = 0;
var currentGlobalEmissions = 0;
var currentEmissionsTimer = null;
var userTotalCarbonHome = [];
var userTotalCarbonVehicle = [];
var doneWithAccountForm = 0;

// const express = require('express');


// let newsKey = '826c8d002dc24d088e02c40677ecd5e5'



function navCLicked(event) {
    // Handles user clicks on a nav bar button
  event.preventDefault();
  let targetId = event.target.getAttribute("id");
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
    case "global-carbon-emissions":
      displayNoneAll();
      initializeGlobalEmissions();
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

function initializeGlobalEmissions() {
  let today = moment();
  let startOfTheYear = moment("2021-01-01 00:00:00")
  let difference = Math.round(moment.duration(today.diff(startOfTheYear)).as("seconds"));
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



function loginFormHandler() {
  console.log('started')
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();
  if (email && password) {
    console.log(email, password)
    $.post('/api/users/login', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: email,
        password: password
      },
      success: () => {
        console.log('logged in!')
        document.location.replace('/');
      },
      error: (err) => {
        alert(err);
      }
    });
  }
}

 function signupFormHandler(event) {
 

  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    $.ajax('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        username: username,
        email: email,
        password: password
      },
      success: () => {
        console.log('Account Created!')
        document.location.replace('/');
      },
      error: (err) => {
        alert(err);
      }
    });
  }
  
}

function logout(event) {
  $.ajax('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    
    success: () => {
      console.log('logged out!')
      document.location.replace('/');
    },
    error: (err) => {
      alert(err);
    }
  });
}

function checkAccountForm() {
  if (doneWithAccountForm === 4) {
    $('#accountFinalSubmit').removeClass('d-none')
  }
}

function addPersonalTotalEmissions() {

}


$('#submit-login').on('click', (event) => {
  event.preventDefault();
  loginFormHandler();
});

$('#submit-signup').on('click', (event) => {
  event.preventDefault();
  signupFormHandler();
});

$('#logout').on('click', (event) => {
  event.preventDefault();
  logout();
});


//Event Handlers
  $("#header").on("click", navCLicked);

// Account Form Events
  $("#pastStateNext").on('click', (event) => {
    event.preventDefault();
    let state = $('#pastState').val();
    let year = parseInt($('#pastStateYears').val())
    if (state && year) {
      state = state.toLowerCase();
      let temp = {};
      temp[state] = year;
      userTotalCarbonHome.push(temp);
      $('#pastState').val('');
      $('#pastStateYears').val('');
      console.log(userTotalCarbonHome);
    } else {
      alert('You must enter in a valid state and year!');
    }
  });

  $('#pastStateSubmit').on('click', (event) => {
    event.preventDefault();
    let state = $('#pastState').val()
    let year = parseInt($('#pastStateYears').val());
    if (state && year) {
      state = state.toLowerCase()
      let temp = {};
      temp[state] = year;
      userTotalCarbonHome.push(temp);
    }
    $('#pastHomeForm').addClass('d-none');
    $('#pastHomeCheck').removeClass('d-none');
    doneWithAccountForm ++;
  });

  $('#pastVehicleNext').on('click', (event) => {
    event.preventDefault();

  });


  // Vehicle Make Selected Events

  $('#pastVehicleMake').on('change', (event) => {
    event.preventDefault();
    let make = $('#pastVehicleMake').val();
    $('#pastVehicleModel').empty();
    $.ajax('/api/carbon/models?make=' + make, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      success: (data) => {
        let html = [];
        for (let i = 0; i < data.length; i++) {
          let temp = "<option value=" + data[i] + ">" + data[i] + "</option";
          html.push(temp);
        }
        $("#pastVehicleModel").append(html);
        $('#pastVehicleModel').removeAttr('disabled')
      }
    });
  });

  $('#vehicleMake').on('change', (event) => {
    event.preventDefault();
    let make = $('#vehicleMake').val();
    $('#vehicleModel').empty();
    $.ajax('/api/carbon/models?make=' + make, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      success: (data) => {
        let html = [];
        for (let i = 0; i < data.length; i++) {
          let temp = "<option value=" + data[i] + ">" + data[i] + "</option";
          html.push(temp);
        }
        $("#vehicleModel").append(html);
        $('#vehicleModel').removeAttr('disabled');
      }
    });
  });

  $('#make').on('change', (event) => {
    event.preventDefault();
    let make = $('#make').val();
    $('#model').empty();
    $.ajax('/api/carbon/models?make=' + make, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      success: (data) => {
        let html = [];
        for (let i = 0; i < data.length; i++) {
          let temp = "<option value=" + data[i] + ">" + data[i] + "</option";
          html.push(temp);
        }
        $("#model").append(html);
        $('#model').removeAttr('disabled')
      }
    });
  });

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



