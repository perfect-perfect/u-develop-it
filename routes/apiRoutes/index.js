// index.js will act as a central hub to put all the routes together
const express = require('express');
// since this is the central hub, we have to have router in here as well since requests will come here first
const router = express.Router();

// these give us access to the routes in these files
router.use(require('./candidateRoutes'));
router.use(require('./partyRoutes'));
router.use(require('./voterRoutes'));

module.exports = router;