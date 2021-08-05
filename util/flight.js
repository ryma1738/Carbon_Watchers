const axios = require('axios');

async function flightEstimateRequest(legs, passCount) {
  try {
    const{ data } = await axios({
      url: "https://www.carboninterface.com/api/v1/estimates",
      method: "post",
      headers: {
        'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
        'content-type': 'application/json'
      },
      data: {
        type: "flight",
        passengers: passCount,
        distance_unit: "mi",
        legs: legs
      }
  });
  return data.data.attributes;
  
  } catch (err) {
    return {error: 'Flight airport codes not found. Please enter correct information!', err: err};
  } 
};

module.exports = {
    flightEstimateRequest
}
