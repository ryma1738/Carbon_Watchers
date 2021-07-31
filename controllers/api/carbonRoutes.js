const router = require('express').Router();
const { getVehicleMake, getVehicleModel, vehicleEstimateRequest } = require('../../util/vehicles');

router.get('/vehicle', async function (req, res) {
   let makeId = await getVehicleMake(req.query.make.toLowerCase());
    if (!makeId) {
        res.json({message: "Vehicle make not found. Please enter a valid vehicle make!"})
    } else {
        let modalId = await getVehicleModel(makeId, req.query.modal.toLowerCase(), parseInt(req.query.year));
        if (!modalId) {
            res.json({message: "Vehicle model and/or year not found. Please enter a valid vehicle model and year!"})
        } else {
            let carbonData = await vehicleEstimateRequest(modalId, req.query.dValue, req.query.dUnit);
            res.json(carbonData);
        }
    }
});

router.get('/flight', async function (req, res) {
    
});

router.get('/shipping', async function (req, res) {

});

router.get('/electricity', async function (req, res) {

});

module.exports = router;