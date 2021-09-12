  
const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.post('/container', indexController.queryContainer);


module.exports = router;