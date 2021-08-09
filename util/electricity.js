const axios = require('axios');
const { readFileSync, copyFileSync } = require('fs');
const path = require('path');
require('dotenv').config();

async function electricityEstimateRequest(itemArray) {
    //Source for JSON File: https://www.chooseenergy.com/news/article/the-states-that-use-the-most-and-least-amount-of-energy-per-household/
    const rawData = readFileSync(path.join(__dirname, "./states.json"))
    const states = JSON.parse(rawData);
    let carbonLbs = 0;
    let carbonMt = 0;
    //Carbon emissions stayed relatively the same between 1980-now. Only after that did it start to really
    //drop. If the person is over 60 the results may be far to high. but anyone 30-40 or younger are fairly  
    //accurate. Visit: https://ourworldindata.org/grapher/annual-co-emissions-by-region?country=~USA for more info
    for (let i = 0; i < itemArray.length; i++) {
        let state = Object.keys(itemArray[i]);
        let kwh = (states[state[0]] * 12) * itemArray[i][state[0]];
        let carbon = await electricityCall(kwh, state[0]);
        if (carbon.error) {
            return {error: carbon.error};
        }
        carbonLbs = carbonLbs + carbon.lbs;
        carbonMt = carbonMt + carbon.mt;
    }
    return {
        lbs: carbonLbs,
        mt: carbonMt
    };
}

async function electricityCall(kwh, state) {
    try {
        const { data } = await axios({
            url: "https://www.carboninterface.com/api/v1/estimates",
            method: "post",
            headers: {
            'Authorization': process.env.API_KEY,
            'content-type': 'application/json'
            },
            data: {
            "type": "electricity",
            "electricity_unit": "kwh",
            "electricity_value": kwh,
            "country": "us",
            "state": state,
            },
        });
        return {lbs: data.data.attributes.carbon_lb, mt: data.data.attributes.carbon_mt};
    } catch (err) {
        return {error: err};
    }
}
module.exports = {
    electricityEstimateRequest
}