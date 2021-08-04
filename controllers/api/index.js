const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const carbonRoutes = require('./carbonRoutes.js');

router.use('/users', userRoutes);
router.use('/carbon', carbonRoutes);
module.exports = router;