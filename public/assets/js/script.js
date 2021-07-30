var airports = {};
var dataTotal = {};
var dataPerPerson = {};
var flightCount = 0;
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
    case "about-us":
      displayNoneAll();
      $("#about-us-page").removeClass("d-none");
      $("#footer").addClass("");
      break;
  }
}

function displayNoneAll() {
  $("#landing-page").addClass("d-none");
  $("#travel-estimates-page").addClass("d-none");
  $("#shipping-page").addClass("d-none");
  $("#global-carbon-emissions-page").addClass("d-none");
  $("#climate-change-page").addClass("d-none");
  $("#about-us-page").addClass("d-none");
 clearInterval(currentEmissionsTimer);
}

function getVehicleMake(event) {
  // gets user data from car form and finds the make, then if it can find it calls the getVehicleModel function.
  event.preventDefault();
  $("#results").html("<p class='px-2 mt-2 text-center' fw-bold>Loading your Results <div class='loader pb-2 my-auto mx-auto'</div></p>");
  var userMake = $("#make").val();
  userMake = userMake.trim().toLowerCase().split(" ");
    for (var i = 0; i < userMake.length; i++) {
        userMake[i] = userMake[i].charAt(0).toUpperCase() + userMake[i].substring(1);
    }
    userMake = userMake.join(" ");
    var testUnit = $("#distance-unit").val()
    if (!testUnit) {
      $("#results").html("<p class='text-center px-2 py-3'>You must select a distance unit!</p>");
      return;
    }

  $.ajax({
    url: 'https://www.carboninterface.com/api/v1/vehicle_makes',
    method: "GET",
    contentType: "application/json",
    beforeSend: function(xhr) {
         xhr.setRequestHeader("Authorization", "Bearer HZOkJvglLARzHsXWm755Q")
    }, success: function(data){
        console.log(data);
        var check = false;
        for (var i = 0; i < data.length; i++) {
          if (userMake === data[i].data.attributes.name) {
            var make = data[i].data.id;
            check = true;
            break;
          }
        }
        if (!check) {
          $("#results").html("<p class='text-center px-2 py-3'>Vehicle make not found. Please enter a valid vehicle make!</p>");
        }
        else {
          getVehicleModel(userMake, make);
        }
    }, error: function() {
      alert("Their was a network error while trying to get your request. Please try again.");
      $("#results").html(" ");
    }
  })
}

function getVehicleModel(make, makeID) {
//Gets the remaining info from the car form to find the model id to get the CO2 emeition information.
  var userModel = $("#model").val();
  userModel = userModel.trim().toLowerCase().split(" ");
    for (var i = 0; i < userModel.length; i++) {
        userModel[i] = userModel[i].charAt(0).toUpperCase() + userModel[i].substring(1);
    }
    userModel = userModel.join(" ");

    var userYear = $("#year").val();
    userYear = userYear.trim();
    userYear = parseInt(userYear);

  $.ajax({
    url: 'https://www.carboninterface.com/api/v1/vehicle_makes/' + makeID + "/vehicle_models",
    method: "GET",
    contentType: "application/json",
    beforeSend: function(xhr) {
         xhr.setRequestHeader("Authorization", "Bearer HZOkJvglLARzHsXWm755Q")
    }, success: function(data){
        var check = false;
        for (var i = 0; i < data.length; i++) {
          if (userModel === data[i].data.attributes.name && userYear === data[i].data.attributes.year) {
            var car = data[i].data.id;
            check = true;
            break;
          }
        }
        if (!check) {
          $("#results").html("<p class='text-center px-2 py-3'>Vehicle model and/or year not found. Please enter a valid vehicle model and year!</p>");
        }
        else {
          vehicleEstimateRequest(car, make, userModel, userYear);
        }
    }, error: function() {
      alert("Their was a network error while trying to get your request. Please try again.");
      $("#results").html(" ");
    }
  })
}

function vehicleEstimateRequest(modelID, make, model, year) {
  //Posts the request to the API and gets the carbon emitions
  var distanceUnit = $("#distance-unit").val();
  var distanceValue = $("#distance-value").val();
  distanceValue = parseInt(distanceValue.trim());

  fetch("https://www.carboninterface.com/api/v1/estimates", {
    method: "post",
    headers: {
      'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "type": "vehicle",
      "distance_unit": distanceUnit,
      "distance_value": distanceValue,
      "vehicle_model_id": modelID
    }),
  }).then((response) => response.json())
  .then((data) => {
    if (distanceUnit === "mi") {
      var unit = "Miles";
    }
    else if(distanceUnit === "km") {
      var unit = "Kilometers";
    }
    var carbonEmitions = data.data.attributes.carbon_lb;
    $("#results")
    .html("<p class='py-2 px-2 text-center'>Your total cabon emitions for your <span class='main-color fw-bold'>" + make + " " + model + " " + year + "</span> after driving <span class='main-color fw-bold'>" + distanceValue + " " + unit + "</span> would be: <span class='main-color fw-bold'>" + carbonEmitions + " Pounds</span> of CO2 released in to the atmosphere. </p>" );
  });
}

function flightFormSubmit(event) {
  event.preventDefault();
  flightCount = 0;
  $("#results").html("<p class='px-2 mt-2 text-center'>Loading your Results <div class='loader pb-2 my-auto mx-auto'</div></p>");

  if ($("#return-trip").is(':checked')) {
    $("#return-trip").attr('value', true);
  }
  else {
    $("#return-trip").attr('value', false);
  }
  var passengers = $("#passengers").val();
  var departureAirport = $("#d-airport-code").val();
  var arivingAirport = $("#a-airport-code").val();
  var returnTrip = $("#return-trip").val();
  var legs = [];

  arivingAirport = arivingAirport.toLowerCase();
  departureAirport = departureAirport.toLowerCase();
  var tempAirport = {
    "departure_airport": departureAirport,
    "destination_airport": arivingAirport
  }
  legs.push(tempAirport);

  if (returnTrip === 'true') {
    tempAirport = {
      "departure_airport": arivingAirport,
      "destination_airport": departureAirport
    };
    legs.push(tempAirport);
  }

  flightEstimateRequest(passengers, legs);
}

function postFlightData() {
  var pounds = dataTotal.data.attributes.carbon_lb;
  var mt = dataTotal.data.attributes.carbon_mt;
  var distance = dataTotal.data.attributes.distance_value;
  var carbonPerPerson = dataPerPerson.data.attributes.carbon_lb;

  $("#results").html("<p class='py-2 px-2 text-center'>Your total cabon emitions for your flight are <span class='main-color fw-bold'>" + pounds + " Pounds or " + mt + " Metric Tons " + "</span>of CO2 put in to the atmosphere with a total distance traveled of: <span class='main-color fw-bold'>" + distance + " Miles" +"</span>. The carbon emissions per person are:  <span class='main-color fw-bold'>" + carbonPerPerson + " Pounds</span> of CO2 released per person in to the atmosphere durring the flight. </p>" );
}  

function flightEstimateRequest(passengers, legs) {
  // average flights each day: 285,0000
  fetch("https://www.carboninterface.com/api/v1/estimates", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "type": "flight",
        "passengers": passengers,
        "distance_unit": "mi",
        "legs": legs
    }),
  }).then((response) => response.json())
  .then((data) => {
    if (data.message) {
      $("#results").html("<p class='text-center px-2 py-3'>Airport ID not found. Please use the airports 3 letter IATA code.</p>");
      return;
    }
    flightCount++;
    if (flightCount === 1) {
      dataTotal = data;
      flightEstimateRequest(1, legs);
    }
    else if (flightCount === 2) {
      dataPerPerson = data;    
      postFlightData();
      flightCount = 0;
    }
  });
}

// function electricityEstimateRequest() {
//   //fetches electricity estimates from the api based on user data.
//   fetch("https://www.carboninterface.com/api/v1/estimates", {
//     method: "POST",
//     headers: {
//       'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
//       'content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       "type": "electricity",
//       "electricity_unit": "kwh",
//       "electricity_value": 100,
//       "country": "us",
//       "state": "ut",
//     }),
//   }).then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   });
// }

function shippingFormSubmit(event) {
  event.preventDefault();
  $("#results-shipping").html("<p class='px-2 mt-2 text-center'>Loading your Results <div class='loader pb-2 my-auto mx-auto'</div></p>");

  var weightValue = $("#weight-value").val();
  var weightUnit = $("#weight-unit").val();
  var distanceValue = $("#s-distance-value").val();
  var distanceUnit = $("#s-distance-unit").val();
  var shippingMethod = $("#shipping-method").val();
  
  if (weightValue <= 0.1) {
    $("#results").html("<p class='text-center px-2 py-3'>Weight value must be greater than 0.1! Please enter a valid weight value</p>");
    return;
  }
  if (distanceValue <= 0) {
    $("#results").html("<p class='text-center px-2 py-3'>Distance value must be greater than 0! Please enter a valid distance value.</p>");
     return;
  }
 
  shippingEstimateRequest(weightValue, weightUnit, distanceValue, distanceUnit, shippingMethod);
}

function shippingEstimateRequest(weight, weightUnit, distance, distanceUnit, method) {
  //fetches shipping estimates from the api based on user data
  fetch("https://www.carboninterface.com/api/v1/estimates", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "type": "shipping",
      "weight_value": weight,
      "weight_unit": weightUnit,
      "distance_value": distance,
      "distance_unit": distanceUnit,
      "transport_method": method
    }),
  }).then((response) => response.json())
  .then((data) => {
    if (data.message) {
      $("#results-shipping").html("<p class='text-center px-2 py-3'>Server Error: Invalid Request Please try again.</p>");
      return;
    }
    if (distanceUnit === "mi"){
      distanceUnit = "Miles";
    }
    else {
      distanceUnit = "Kilometers";
    }
    var carbonG = Math.round((data.data.attributes.carbon_g ) * 100) / 100;
    var carbonlb = Math.round((data.data.attributes.carbon_lb) * 100) / 100;
    var carbonMT = Math.round((data.data.attributes.carbon_mt) * 100) / 100;

    if (carbonG < 500) {
      $("#results-shipping").html("<p class='text-center px-2 py-3'>Your package would create <span class='main-color'>" + carbonG + " grams</span> of CO2 emissions after traveling " + distance + " " + distanceUnit + " via " + method +  ".</p>");
    }
    else if (carbonlb >= 1.1 && carbonlb <= 2250) {
      $("#results-shipping").html("<p class='text-center px-2 py-3'>Your package would create <span class='main-color'>" + carbonlb + " pounds</span> of CO2 emissions after traveling " + distance + " " + distanceUnit + " via " + method +  ".</p>");
    }
    else if (carbonMT > 1) {
      $("#results-shipping").html("<p class='text-center px-2 py-3'>Your package would create <span class='main-color'>" + carbonMT + " metric tons</span> of CO2 emissions after traveling " + distance + " " + distanceUnit + " via " + method +  ".</p>");
    }
  });  
}

function initalizeGlobalEmissions() {
  var today = moment();
  var startOfTheYear = moment("2021-01-01 00:00:00")
  var diffrence = Math.round(moment.duration(today.diff(startOfTheYear)).as("seconds"));
  currentAviationEmissions = 29.90233 * diffrence;
  currentVehicleEmissions = 190.25875 * diffrence;
  currentShippingEmissions = 26.88990 * diffrence;
  currentEnergyEmissions = 1049.59411 * diffrence;
  currentGlobalEmissions = 1296.64510 * diffrence;
  currentEmissionsTimer = setInterval(globalEmissions, 10);
}

function globalEmissions() {
  currentAviationEmissions = Math.round((currentAviationEmissions + 0.2990233) * 100) / 100;
  var tempAviation = Math.round(currentAviationEmissions);
  var aviation = tempAviation.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#current-aviation").text(aviation);

  currentVehicleEmissions = Math.round((currentVehicleEmissions + 1.9025875) * 100) / 100;
  var tempVehicles = Math.round(currentVehicleEmissions);
  var vehicles = tempVehicles.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#current-vehicle").text(vehicles);

  currentShippingEmissions = Math.round((currentShippingEmissions + 0.2688990) *100) / 100;
  var tempShipping = Math.round(currentShippingEmissions);
  var shipping = tempShipping.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#current-shipping").text(shipping);

  currentEnergyEmissions = Math.round((currentEnergyEmissions + 10.4959411) * 100) / 100;
  var tempEnergy = Math.round(currentEnergyEmissions);
  var energy = tempEnergy.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#current-energy").text(energy);

  currentGlobalEmissions = Math.round((currentGlobalEmissions + 12.9664510) * 100) / 100;
  var tempGlobal = Math.round(currentGlobalEmissions);
  var global = tempGlobal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#current-global").text(global);
}

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
  $("#vehicle-form").on("submit", getVehicleMake);
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


