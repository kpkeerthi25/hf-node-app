  
const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/container/:id', indexController.queryEvent);
router.post('/createEvent',indexController.createEvent);


module.exports = router;