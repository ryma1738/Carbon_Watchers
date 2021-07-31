const axios = require('axios');

async function flightEstimateRequest() {
    let flight = await axios({
        url: "https://www.carboninterface.com/api/v1/estimates",
        method: "post",
        headers: {
          'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
          'content-type': 'application/json'
        },
        data: {
          "type": "shipping",
          "weight_value": weight,
          "weight_unit": weightUnit,
          "distance_value": distance,
          "distance_unit": distanceUnit,
          "transport_method": method
        }
    });
};

module.exports = {
    flightEstimateRequest
}