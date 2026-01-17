const express = require('express');
const router = express.Router();
const { listProducts, getProduct, createProduct } = require('../controllers/productsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, requireAdmin, createProduct);

module.exports = router;