const express = require('express');
const router = express.Router();
const loc = require('../controllers/locationsController');
const { authenticate } = require('../middleware/auth');

router.get('/departments', loc.listDepartments);
router.get('/hospitals', loc.listHospitals);
router.get('/hospitals/:id', loc.getHospital);
router.get('/addresses', loc.listAddresses);
router.get('/emergencies', loc.listEmergencies);

router.post('/validate/phone', loc.validatePhone);
router.post('/whatsapp/share', loc.whatsappShare);

// Estimate distance and ETA
router.post('/estimate', loc.estimateTransfer);

module.exports = router;