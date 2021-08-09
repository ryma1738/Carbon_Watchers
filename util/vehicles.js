const axios = require('axios');
require('dotenv').config();

async function getVehicleMake(make) {
    const { data } = await axios.get('https://www.carboninterface.com/api/v1/vehicle_makes', {
        headers: {
            'Authorization': process.env.API_KEY,
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
        'Authorization': process.env.API_KEY,
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
    try {
        const { data } = await axios({
            url: "https://www.carboninterface.com/api/v1/estimates",
            method: 'post',
            headers: {
                'Authorization': process.env.API_KEY,
                'content-type': 'application/json'
            },
            data: {
                type: "vehicle",
                distance_unit: distanceUnit,
                distance_value: distanceValue,
                vehicle_model_id: modelID
            },
        });
        return data.data.attributes;
    } catch (err) {
        return {error: err}
    }
      
  }

  module.exports = {
      getVehicleMake,
      getVehicleModel,
      vehicleEstimateRequest
    };