const router = require('express').Router();
const { getVehicleMake, getVehicleModel, vehicleEstimateRequest } = require('../../util/vehicles');
const { flightEstimateRequest } = require('../../util/flight');
const { shippingEstimateRequest } = require('../../util/shipping');
const { electricityEstimateRequest } = require('../../util/electricity');
const axios = require('axios');
require('dotenv').config();

router.get('/vehicle', async function (req, res) {
    // queries: ?make=toyota&model=86&year=2017&dValue=100&dUnit=mi
   const makeId = await getVehicleMake(req.query.make.toLowerCase());
    if (!makeId) {
        res.status(400).json({message: "Vehicle make not found. Please enter a valid vehicle make!"})
    } else {
        const modelId = await getVehicleModel(makeId, req.query.model.toLowerCase(), parseInt(req.query.year));
        if (!modelId) {
            res.status(422).json({message: "Vehicle model and/or year not found. Please enter a valid vehicle model and year!"})
        } else {
            const carbonData = await vehicleEstimateRequest(modelId, req.query.dValue, req.query.dUnit);
            if (carbonData.error) {
                res.status(500).json({error: carbonData.error});
            } else {
                res.status(200).json(carbonData);
            }
        }
    }
});

router.get('/flight', async function (req, res) {
    // queries: ?arrival=slc&depart=den&roundTrip=true
    let legs = [];
    let estimate = [];
    if (req.query.roundTrip) {
        legs = [
            {"departure_airport": req.query.depart, "destination_airport": req.query.arrival},
            {"departure_airport": req.query.arrival, "destination_airport": req.query.depart}
        ];
    } else {
        legs = [
            {"departure_airport": req.query.depart, "destination_airport": req.query.arrival}
        ];
    }
    let flightInfoPerPerson = await flightEstimateRequest(legs, 1);
    if (flightInfoPerPerson.error) {
        res.status(422).json(flightInfoPerPerson.error);
    } else {
        estimate.push(flightInfoPerPerson);
        let flightInfo = await flightEstimateRequest(legs, 100);
        estimate.push(flightInfo);
        res.status(200).json(estimate);
    }
});

router.get('/shipping', async function (req, res) {
    // queries: ?weight=200&distance=1000&dUnit=mi&wUnit=lb&method=truck
    let shipping = await shippingEstimateRequest(parseInt(req.query.weight), parseInt(req.query.distance),
     req.query.dUnit.toLowerCase(), req.query.wUnit.toLowerCase(), req.query.method.toLowerCase());
     if (shipping.error) {
         res.status(422).json(shipping.error);
     }
     res.status(200).json(shipping);
});

router.post('/electricity', async function (req, res) {
    // body = [{"ut": 5}, {"ca": 2}]
    let estimate = await electricityEstimateRequest(req.body);
    if (estimate.error) {
        res.status(422).json({message: estimate.error});
    } else {
        res.status(200).json(estimate);
    }
});

router.post('/vehicle', async function (req, res) {
    //body = [{make: toyota, model: 86, year: 2017, dValue: 100, dUnit: mi}, {...}]
    let totalCarbonLbs = 0;
    let totalCarbonMt = 0;
    try {
        for (let i = 0; i < req.body.length; i++) {
            const makeId = await getVehicleMake(req.body[i].make.toLowerCase());
            const modelId = await getVehicleModel(makeId, req.body[i].model.toLowerCase(), parseInt(req.body[i].year));
            const carbonData = await vehicleEstimateRequest(modelId, req.body[i].dValue, req.body[i].dUnit);
            totalCarbonLbs = totalCarbonLbs + carbonData.carbon_lbs;
            totalCarbonMt = totalCarbonMt + carbonData.carbon_mt;
        }
        res.status(200).json({lbs: totalCarbonLbs, mt: totalCarbonMt});
    } catch (err) {
        res.status(422).json({error: err});
    }
    
    
});

router.get('/models', async function (req, res) {
    // query = ?make=Toyota
    let makeId = await getVehicleMake(req.query.make.toLowerCase());
    const { data } = await axios.get('https://www.carboninterface.com/api/v1/vehicle_makes/' + makeId + "/vehicle_models", {
      headers: {
        'Authorization': process.env.API_KEY,
        'content-type': 'application/json'
      }
    });
    let models = [];
    for (let i = 0; i < data.length; i++) {
        let model = data[i].data.attributes.name;
        if (models.indexOf(model) == -1) {
            models.push(model);
        } 
    }
    models = models.sort();
    res.status(200).json(models);
});

module.exports = router;