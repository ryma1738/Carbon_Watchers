const axios = require('axios');

async function shippingEstimateRequest(weight, distance, distanceUnit, weightUnit, method) {
        const { data } = await axios({
            url: "https://www.carboninterface.com/api/v1/estimates",
            method: "post",
            headers: {
            'Authorization': 'Bearer HZOkJvglLARzHsXWm755Q',
            'content-type': 'application/json'
            },
            data: {
                type: "shipping",
                weight_value: weight,
                weight_unit: weightUnit,
                distance_value: distance,
                distance_unit: distanceUnit,
                transport_method: method
            }
        });
        return data.data.attributes;
};

module.exports = {
    shippingEstimateRequest
}