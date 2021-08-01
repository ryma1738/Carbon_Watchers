const axios = require('axios');
const fs = require('fs');

async function electricityEstimateRequest(electricityValue, state, years) {
  //fetches electricity estimates from the api based on user data.
  
  
  const { data } = await axios({
    url: "https://www.carboninterface.com/api/v1/estimates",
    method: "post",
    headers: {
      'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
      'content-type': 'application/json'
    },
    data: {
      "type": "electricity",
      "electricity_unit": "kwh",
      "electricity_value": electricityValue,
      "country": "us",
      "state": state,
    },
  });
  return data.data.attributes;
}

module.exports = {
    electricityEstimateRequest
}