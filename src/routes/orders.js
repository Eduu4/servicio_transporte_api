const express = require('express');
const router = express.Router();
const { createOrder, getOrder } = require('../controllers/ordersController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createOrder);
router.get('/:id', authenticate, getOrder);

module.exports = router;