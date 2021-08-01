const router = require('express').Router();
const { getVehicleMake, getVehicleModel, vehicleEstimateRequest } = require('../../util/vehicles');
const { flightEstimateRequest } = require('../../util/flight');
const { shippingEstimateRequest } = require('../../util/shipping');

router.get('/vehicle', async function (req, res) {
    // queries: ?make=toyota&model=86&year=2017&dValue=100&dUnit=mi
   let makeId = await getVehicleMake(req.query.make.toLowerCase());
    if (!makeId) {
        res.json({message: "Vehicle make not found. Please enter a valid vehicle make!"})
    } else {
        let modelId = await getVehicleModel(makeId, req.query.model.toLowerCase(), parseInt(req.query.year));
        if (!modelId) {
            res.json({message: "Vehicle model and/or year not found. Please enter a valid vehicle model and year!"})
        } else {
            let carbonData = await vehicleEstimateRequest(modelId, req.query.dValue, req.query.dUnit);
            res.json(carbonData);
        }
    }
});

router.get('/flight', async function (req, res) {
    // queries: ?arrival=slc&depart=den&roundTrip=true&passCount=100
    let legs = [];
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
    let flightInfo = await flightEstimateRequest(legs, req.query.passCount);
    res.json(flightInfo);
});

router.get('/shipping', async function (req, res) {
    // queries: ?weight=200&distance=1000&dUnit=mi&wUnit=lb&method=truck
    let shipping = await shippingEstimateRequest(parseInt(req.query.weight), parseInt(req.query.distance),
     req.query.dUnit.toLowerCase(), req.query.wUnit.toLowerCase(), req.query.method.toLowerCase());
     res.json(shipping);
});

router.post('/electricity', async function (req, res) {

});

module.exports = router;