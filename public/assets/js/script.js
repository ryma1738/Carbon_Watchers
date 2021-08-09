// const aviationGlobalEmissions = 943000000;  //943,000,000 Metric Tons, 29.90233 Metric Tons per Second, 0.2990233 every 10ms
// const vehicleGlobalEmissions = 6000000000;   //6,000,000,000 Metric Tons, 190.25875 Metric Tons per Second, 1.9025875 every 10ms
// const shippingGlobalEmissions = 848000000;   //848,000,000 Metric Tons, 26.88990 Metric tons per Second, 0.2688990 every 10ms
// const energyGenerationGlobalEmissions = 33100000000; //33,100,000,000 Metric Tons, 1,049.59411 Metric Tons per Second, 10.4959411 every 10ms
// const totalGlobalEmissions = 40891000000 ; //40,891,000,000 Metric Tons, 1,296.64510 Metric Tons per Second, 12.9664510 every 10ms
let currentAviationEmissions = 0;
let currentVehicleEmissions = 0;
let currentShippingEmissions = 0;
let currentEnergyEmissions = 0;
let currentGlobalEmissions = 0;
let currentUserEmissionsLbs = 0;
let currentUserEmissionsMt = 0;
let currentEmissionsTimer = null;

let useUserCarbon = false; //These values are need to make the users Current emissions work
let userCPerSecLbs = 0.0;
let userCPerMsLbs = 0.0;
let userCPerSecMt = 0.0;
let userCPerMsMt = 0.0;
let userTotalCarbonHome = [];
let userTotalCarbonVehicle = [];
let userTotalCarbonCurrent = {};
let doneWithAccountForm = 0;
let currentUser = null;

// let newsKey = '826c8d002dc24d088e02c40677ecd5e5'

function navCLicked(event) {
    // Handles user clicks on a nav bar button
  event.preventDefault();
  let targetId = event.target.getAttribute("id");
  switch (targetId){
    case "title":
      displayNoneAll();
      $("#global-carbon-emissions-page").removeClass("d-none");
      break;
    case "travel-estimates":
      displayNoneAll();
      $("#travel-estimates-page").removeClass("d-none");
      break;
    case "shipping":
      displayNoneAll();
      $("#shipping-page").removeClass("d-none");
      break;
    case "account":
      displayNoneAll();
      $("#account-page").removeClass("d-none");
      break;
    case "login":
      displayNoneAll();
      $("#login-form").removeClass("d-none");
      $("#footer").addClass("d-none");
      break;
    case "signup":
      displayNoneAll();
      $("#signup-form").removeClass("d-none");
      break;
    // case "logout":
    //   displayNoneAll();
    //   // $("#about-us-page").removeClass("d-none");
    //   break;
  }
}

function displayNoneAll() {
  $("#global-carbon-emissions-page").addClass("d-none");
  $("#travel-estimates-page").addClass("d-none");
  $("#shipping-page").addClass("d-none");
  $("#global-carbon-emissions-page").addClass("d-none");
  $('#login-form').addClass('d-none');
  $('#signup-form').addClass('d-none');
  $('#account-page').addClass('d-none');
}

function navLoggedIn(newUser) {
  $('#login').addClass('d-none');
  $('#signup').addClass('d-none');
  $('#account').removeClass('d-none');
  $('#logout').removeClass('d-none');
  if (!newUser) {
    currentUserUpdate();
  }
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
  if (useUserCarbon) {
    currentUserEmissionsLbs = currentUserEmissionsLbs + (userCPerSecLbs * difference);
    currentUserEmissionsMt = currentUserEmissionsMt + (userCPerSecMt * difference);
  }
  currentEmissionsTimer = setInterval(globalEmissions, 10);
}

function globalEmissions() {
  currentAviationEmissions = Math.round((currentAviationEmissions + 0.2990233) * 100) / 100;
  let tempAviation = Math.round(currentAviationEmissions);
  $("#current-aviation").text(tempAviation.toLocaleString());

  currentVehicleEmissions = Math.round((currentVehicleEmissions + 1.9025875) * 100) / 100;
  let tempVehicles = Math.round(currentVehicleEmissions);
  $("#current-vehicle").text(tempVehicles.toLocaleString());

  currentShippingEmissions = Math.round((currentShippingEmissions + 0.2688990) *100) / 100;
  let tempShipping = Math.round(currentShippingEmissions);
  $("#current-shipping").text(tempShipping.toLocaleString());

  currentEnergyEmissions = Math.round((currentEnergyEmissions + 10.4959411) * 100) / 100;
  let tempEnergy = Math.round(currentEnergyEmissions);
  $("#current-energy").text(tempEnergy.toLocaleString());

  currentGlobalEmissions = Math.round((currentGlobalEmissions + 12.9664510) * 100) / 100;
  let tempGlobal = Math.round(currentGlobalEmissions);
  $("#current-global").text(tempGlobal.toLocaleString());

  if (useUserCarbon) {
    currentUserEmissionsLbs = currentUserEmissionsLbs + userCPerMsLbs;
    let tempUserLbs = Math.round(currentUserEmissionsLbs * 1000) / 1000;
    $("#current-user-lbs").text(tempUserLbs.toLocaleString());

    currentUserEmissionsMt = currentUserEmissionsMt + userCPerMsMt ;
    let tempUserMt = Math.round(currentUserEmissionsMt * 1000) / 1000;
    $("#current-user-mt").text(tempUserMt.toLocaleString());
  }
}

function loginFormHandler() {
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();
  if (email && password) {
    fetch('/api/users/login', {
      method: "post",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    }).then((response) => response.json()).then((data) => {
      if (data.message) {
        alert(data.message);
        return;
      }
      currentUser = data.id;
      navLoggedIn(false);
    }) 
  }
}

 function signupFormHandler(event) {
  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    fetch('/api/users/signup', {
      method: "post",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    }).then((response) => response.json()).then((data) => {
      currentUser = data.id;
      navLoggedIn(true);
    });
  }
  
}

function logout() {
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

function vehicleFormSubmit(event) {
  event.preventDefault();
  let make = $('#make').val();
  let model = $('#model').val();
  let year = $('#year').val();
  let dValue = $('#distance-value').val();
  let dUnit = $('#distance-unit').val();
  if (make && model && year && dValue && dUnit) {
    $("#results").html("<p class='px-2 mt-2 text-center' fw-bold>Loading your Results <div class='loader pb-2 my-auto mx-auto'</div></p>");
    $.ajax({
      url: '/api/carbon/vehicle?make=' + make + '&model=' + model + '&year=' + year+ '&dValue=' + dValue + '&dUnit=' + dUnit,
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      success: (data) => {
        let carbonLbs = data.carbon_lb;
        let carbonMt = data.carbon_mt;
        if (carbonMt > 5) {
          $("#results")
          .html("<p class='py-2 px-2 text-center'>Your total carbon emissions for your <span class='main-color fw-bold'>" + make + " " + model + " " + year + "</span> after driving <span class='main-color fw-bold'>" + dValue + " " + dUnit.toUpperCase() + "</span> would be: <span class='main-color fw-bold'>" + carbonLbs + " Pounds</span> of CO2 released in to the atmosphere or <span class='main-color fw-bold'>" + carbonMt + " Metric Tons</span> of CO2.</p>" );
        } else {
          $("#results")
          .html("<p class='py-2 px-2 text-center'>Your total carbon emissions for your <span class='main-color fw-bold'>" + make + " " + model + " " + year + "</span> after driving <span class='main-color fw-bold'>" + dValue + " " + dUnit.toUpperCase() + "</span> would be: <span class='main-color fw-bold'>" + carbonLbs + " Pounds</span> of CO2 released in to the atmosphere. </p>" );
        }
      },
      error: (jxr, stat, err) => {
        console.log(err);
        if (err === 'Unprocessable Entity') {
          $("#results").html("<p class='text-center px-2 py-3'>Vehicle model and/or year not found. Please enter a valid vehicle model and year!</p>");
        } else {
          alert("Their was a network error while trying to get your request. Please try again.");
        $("#results").html(" ");
        }
      }
    })
  } else {
    alert('You must enter in all information before submitting!');
  }
}

function flightFormSubmit(event) {
  event.preventDefault();
  let depart = $('#d-airport-code').val();
  let arrival = $('#a-airport-code').val();
  if ($("#return-trip").is(':checked')) {
    $("#return-trip").attr('value', true);
  }
  else {
    $("#return-trip").attr('value', false);
  }
  let roundTrip = $('#return-trip').val();
  if (depart && arrival) {
    depart = depart.toLowerCase();
    arrival = arrival.toLowerCase();
    $("#results")
    .html("<p class='px-2 mt-2 text-center' fw-bold>Loading your Results <div class='loader pb-2 my-auto mx-auto'</div></p>");
    $.ajax({
      url: '/api/carbon/flight?arrival=' + arrival + '&depart=' + depart + '&roundTrip=' + roundTrip,
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      success: (data) => {
        let perPersonLbs = data[0].carbon_lb;
        let distance = data[0].distance_value;
        let flightCarbonLbs = data[1].carbon_lb;
        let flightCarbonMt = data[1].carbon_mt;
        $("#results")
        .html("<p class='py-2 px-2 text-center'>Your total carbon emissions for your flight are <span class='main-color fw-bold'>" + flightCarbonLbs + " Pounds or " + flightCarbonMt + " Metric Tons " + "</span>of CO2 put in to the atmosphere with a total distance traveled of: <span class='main-color fw-bold'>" + distance + " Miles" +"</span>. The carbon emissions per person (on an average flight) are:  <span class='main-color fw-bold'>" + perPersonLbs + " Pounds</span> of CO2 released per person in to the atmosphere during the flight. </p>" );
      },
      error: (jxr, stat, err) => {
        if (err === 'Unprocessable Entity') {
          $("#results").html("<p class='text-center px-2 py-3'>Airport ID not found. Please use the airports 3 letter IATA code.</p>");
        } else {
          alert("Their was a network error while trying to get your request. Please try again.");
        $("#results").html(" ");
        }
      }
    });
  } else {
    alert('You must enter in all information before submitting!');
  }
}

function shippingFormSubmit(event) {
  event.preventDefault();
  let weight = $('#weight-value').val();
  let weightUnit = $('#weight-unit').val();
  let distance = $('#s-distance-value').val();
  let distanceUnit = $('#s-distance-unit').val();
  let shippingMethod = $('#shipping-method').val();
  if (weight <= 0.1) {
    $("#results-shipping").html("<p class='text-center px-2 py-3'>Weight value must be greater than 0.1! Please enter a valid weight value</p>");
    return;
  }
  if (distance <= 0) {
    $("#results-shipping").html("<p class='text-center px-2 py-3'>Distance value must be greater than 0! Please enter a valid distance value.</p>");
     return;
  }
  if (weight && weightUnit && distance && distanceUnit && shippingMethod) {
    $("#results-shipping")
    .html("<p class='px-2 mt-2 text-center' fw-bold>Loading your Results <div class='loader pb-2 my-auto mx-auto'</div></p>");
    $.ajax({
      url: '/api/carbon/shipping?weight=' + weight + '&distance=' + distance +  '&dUnit=' + distanceUnit + '&wUnit=' + weightUnit + '&method=' + shippingMethod,
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      success: (data) => { 
        if (distanceUnit === "mi"){
          distanceUnit = "Miles";
        }
        else {
          distanceUnit = "Kilometers";
        }
        var carbonG = Math.round((data.carbon_g ) * 100) / 100;
        var carbonLbs = Math.round((data.carbon_lb) * 100) / 100;
        var carbonMt = Math.round((data.carbon_mt) * 100) / 100;
    
        if (carbonG < 500) {
          $("#results-shipping").html("<p class='text-center px-2 py-3'>Your package would create <span class='main-color'>" + carbonG + " grams</span> of CO2 emissions after traveling " + distance + " " + distanceUnit + " via " + shippingMethod + ".</p>");
        }
        else if (carbonLbs >= 1.1 && carbonLbs <= 2250) {
          $("#results-shipping").html("<p class='text-center px-2 py-3'>Your package would create <span class='main-color'>" + carbonLbs + " pounds</span> of CO2 emissions after traveling " + distance + " " + distanceUnit + " via " + shippingMethod + ".</p>");
        }
        else if (carbonMt > 1) {
          $("#results-shipping").html("<p class='text-center px-2 py-3'>Your package would create <span class='main-color'>" + carbonMt + " metric tons</span> of CO2 emissions after traveling " + distance + " " + distanceUnit + " via " + shippingMethod + ".</p>");
        }
      },
      error: (jxr, stat, err) => {
        if (err === 'Unprocessable Entity') {
          $("#results-shipping").html("<p class='text-center px-2 py-3'>Invalid Request: Please try again.</p>");
        } else {
          alert("Their was a network error while trying to get your request. Please try again.");
        $("#results-shipping").html(" ");
        }
      }
    });
  } else {
    alert('You must enter in all information before submitting!');
  }
}

async function checkAccountForm() {
  if (doneWithAccountForm === 4) {
    $('#accountFormComplete').removeClass('d-none');
    $('#accountForm').addClass('d-none');
    let totalCarbonHome = await fetch('/api/carbon/electricity', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(userTotalCarbonHome),
    });
    let totalCarbonVehicle = await fetch('/api/carbon/vehicle', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(userTotalCarbonVehicle),
    });
    let totalCarbonVehicleCurrent = await fetch('/api/carbon/vehicle?make=' + userTotalCarbonCurrent.vehicle.make + 
    '&model=' + userTotalCarbonCurrent.vehicle.model + '&year=' + userTotalCarbonCurrent.vehicle.year + '&dValue=' + 
      userTotalCarbonCurrent.vehicle.dValue + '&dUnit=mi', {
      method: 'get',
      headers: {'content-type': 'application/json'},
    });
    let state = {};
    state[userTotalCarbonCurrent.state] = 1;
    let totalCarbonHomeCurrent = await fetch('/api/carbon/electricity', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify([state]),
    });
    totalCarbonHome = await totalCarbonHome.json().then((data) => data);
    totalCarbonVehicle = await totalCarbonVehicle.json().then((data) => data);
    totalCarbonVehicleCurrent = await totalCarbonVehicleCurrent.json().then((data) => data);
    totalCarbonHomeCurrent = await totalCarbonHomeCurrent.json().then((data) => data);

    currentUserEmissionsLbs = Math.round(totalCarbonHome.lbs + totalCarbonVehicle.lbs);
    currentUserEmissionsMt = Math.round(totalCarbonHome.mt + totalCarbonVehicle.mt);
    userCPerSecLbs = (totalCarbonVehicleCurrent.carbon_lb + totalCarbonHomeCurrent.lbs) / 365 / 24 / 60 / 60;
    userCPerSecMt = (totalCarbonVehicleCurrent.carbon_mt + totalCarbonHomeCurrent.mt) / 365 / 24 / 60 / 60;
    userCPerMsLbs = (totalCarbonVehicleCurrent.carbon_lb + totalCarbonHomeCurrent.lbs) / 365 / 24 / 60 / 60 / 100;
    userCPerMsMt = (totalCarbonVehicleCurrent.carbon_mt + totalCarbonHomeCurrent.mt) / 365 / 24 / 60 / 60 / 100;
    await fetch('/api/users/carbon', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        totalLbs: currentUserEmissionsLbs,
        totalMt: currentUserEmissionsMt,
        carbonSecLbs: userCPerSecLbs,
        carbonSecMt: userCPerSecMt,
        carbonMsLbs: userCPerMsLbs,
        carbonMsMt: userCPerMsMt,
        id: currentUser
      })
    });
    $('#user-unit-lbs').removeClass('d-none');
    $('#user-unit-mt').removeClass('d-none');
    clearInterval(currentEmissionsTimer);
    useUserCarbon = true;
    initializeGlobalEmissions();
  }
}

async function currentUserUpdate() {
  await $.ajax({
    url: '/api/users/carbon?id=' + currentUser,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    success: (data) => {
      if (data.message) {
        return;
      }
      $('#accountFormComplete').removeClass('d-none');
      $('#accountForm').addClass('d-none');
      currentUserEmissionsLbs = data.totalCarbonLbs;
      currentUserEmissionsMt = data.totalCarbonMt;
      userCPerMsLbs = data.carbonMsLbs;
      userCPerMsMt = data.carbonMsMt;
      userCPerSecLbs = data.carbonSecLbs;
      userCPerSecMt = data.carbonSecMt;
      $('#user-unit-lbs').removeClass('d-none');
      $('#user-unit-mt').removeClass('d-none');
      clearInterval(currentEmissionsTimer);
      useUserCarbon = true;
      initializeGlobalEmissions();
    },
    error: (err) => {
      console.log(err);
      alert('An Internal Server ERROR has occurred!');
    }
  });
}

//Event Handlers
 
  $("#header").on("click", navCLicked);

  $('#submit-login').on('click', (event) => {
    event.preventDefault();
    loginFormHandler();
    $('#login-form').addClass('d-none');
    $('#global-carbon-emissions-page').removeClass('d-none');
  });
  
  $('#submit-signup').on('click', (event) => {
    event.preventDefault();
    signupFormHandler();
    $('#signup-form').addClass('d-none');
    $('#global-carbon-emissions-page').removeClass('d-none');

  });
  
  $('#logout').on('click', (event) => {
    event.preventDefault();
    logout();
    $('#global-carbon-emissions-page').removeClass('d-none')

  });

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
    } else {
      alert('You must enter in a valid state and year!');
    }
  });

  $('#pastStateSubmit').on('click', (event) => {
    event.preventDefault();
    let state = $('#pastState').val();
    let year = parseInt($('#pastStateYears').val());
    if (state && year) {
      state = state.toLowerCase();
      let temp = {};
      temp[state] = year;
      userTotalCarbonHome.push(temp);
    }
    $('#pastHomeForm').addClass('d-none');
    $('#pastHomeCheck').removeClass('d-none');
    doneWithAccountForm ++;
    checkAccountForm();
  });

  $('#pastVehicleNext').on('click', (event) => {
    event.preventDefault();
    let make = $('#pastVehicleMake').val();
    let model = $('#pastVehicleModel').val();
    let year = $('#pastVehicleYear').val();
    let miles = $('#pastVehicleMiles').val();
    if (make && model && year && miles) {
      let temp = {
        make: make,
        model: model,
        year: year,
        dValue: miles,
        dUnit: 'mi'
      };
      userTotalCarbonVehicle.push(temp);
      $('#pastVehicleMake').val('Make');
      $('#pastVehicleModel').val('');
      $('#pastVehicleYear').val('');
      $('#pastVehicleMiles').val('');
    } else {
      alert('You must fill out all information about your vehicle before submitting!')
    }
  });

  $('#pastVehicleSubmit').on('click', (event) => {
    event.preventDefault();
    let make = $('#pastVehicleMake').val();
    let model = $('#pastVehicleModel').val();
    let year = $('#pastVehicleYear').val();
    let miles = $('#pastVehicleMiles').val();
    if (make && model && year && miles) {
      let temp = {
        make: make,
        model: model,
        year: year,
        dValue: miles,
        dUnit: 'mi'
      };
      userTotalCarbonVehicle.push(temp);
    }
    $('#pastVehicleForm').addClass('d-none');
    $('#pastVehicleCheck').removeClass('d-none')
    doneWithAccountForm ++;
    checkAccountForm();
  });

  $("#stateSubmit").on('click', (event) => {
    event.preventDefault();
    let state = $('#state').val();
    let year = parseInt($('#stateYears').val())
    if (state && year) {
      state = state.toLowerCase();
      let temp = {};
      temp[state] = year;
      userTotalCarbonHome.push(temp);
      userTotalCarbonCurrent.state = state;
      $('#currentHomeForm').addClass('d-none');
      $('#currentHomeCheck').removeClass('d-none');
      doneWithAccountForm ++;
      checkAccountForm();
    } else {
      alert('You must enter in a valid state and year!');
    }
  });

  $('#vehicleSubmit').on('click', (event) => {
    event.preventDefault();
    let make = $('#vehicleMake').val();
    let model = $('#vehicleModel').val();
    let year = $('#vehicleYear').val();
    let miles = $('#vehicleMiles').val();
    let yearlyMiles = $('#vehicleMilesYearly').val();
    if (make && model && year && miles) {
      let temp = {
        make: make,
        model: model,
        year: year,
        dValue: miles,
        dUnit: 'mi'
      };
      let currentTemp = {
        make: make,
        model: model,
        year: year,
        dValue: yearlyMiles,
        dUnit: 'mi'
      }
      userTotalCarbonCurrent.vehicle = currentTemp;
      userTotalCarbonVehicle.push(temp);
      $('#currentVehicleForm').addClass('d-none');
      $('#currentVehicleCheck').removeClass('d-none')
      doneWithAccountForm ++;
      checkAccountForm();

    } else {
      alert('You must fill out all information about your vehicle before submitting!')
    }
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
  $("#vehicle-form").on("submit", vehicleFormSubmit);
  $("#flight-form").on("submit", flightFormSubmit);
  $("#shipping-form").on("submit", shippingFormSubmit);

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

  initializeGlobalEmissions();