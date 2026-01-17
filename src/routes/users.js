const express = require('express');
const router = express.Router();
const { listUsers, getUser } = require('../controllers/usersController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, listUsers);
router.get('/:id', authenticate, getUser);

module.exports = router;