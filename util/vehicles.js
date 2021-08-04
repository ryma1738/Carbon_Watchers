const axios = require('axios');

async function getVehicleMake(make) {
    const { data } = await axios.get('https://www.carboninterface.com/api/v1/vehicle_makes', {
        headers: {
            'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
            'content-type': 'application/json'
          }
    });
    let check = false;
    for (let i = 0; i < data.length; i++) {
        if (make === data[i].data.attributes.name.toLowerCase()) {
            var makeId = data[i].data.id;
            check = true;
            break;
        }
    }
    if (!check) {
        return false;
    }
    else {
        return makeId;
    }
  }
  
  async function getVehicleModel(makeId, model, year) {
    const {data} = await axios.get('https://www.carboninterface.com/api/v1/vehicle_makes/' + makeId + "/vehicle_models", {
      headers: {
        'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
        'content-type': 'application/json'
      }
    });
    let check = false;
    for (let i = 0; i < data.length; i++) {
        if (model === data[i].data.attributes.name.toLowerCase() && year === data[i].data.attributes.year) {
            var modelID = data[i].data.id;
            check = true;
            break;
        }
    }
    if (!check) {
        return false;
    } else {
        return modelID;
    }
  }
  
  async function vehicleEstimateRequest(modelID, distanceValue, distanceUnit ) {
    const { data } = await axios({
        url: "https://www.carboninterface.com/api/v1/estimates",
        method: 'post',
        headers: {
            'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
            'content-type': 'application/json'
        },
        data: {
            type: "vehicle",
            distance_unit: distanceUnit,
            distance_value: distanceValue,
            vehicle_model_id: modelID
        },
    });
    return data;
      
  }

  module.exports = {
      getVehicleMake,
      getVehicleModel,
      vehicleEstimateRequest
    };