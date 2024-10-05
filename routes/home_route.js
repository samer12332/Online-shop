const express = require('express');
const router = express.Router();
const {getHome} = require('../controllers/home_controller');
const {isAuth} = require('./guards/auth-guard')

router.get('/',  getHome);





module.exports = router;

