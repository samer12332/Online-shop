const express = require('express');
const router = express.Router();
const {isAuth} = require('./guards/auth-guard')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const {getOrders, postOrders, postCancel, postCancelAll, postSaveOrder, postOrderAll} = require('../controllers/orders_controller');

const urlEncoded = bodyParser.urlencoded({extended: true});

router.get('/orders', isAuth, getOrders);



router.post('/orders', isAuth, urlEncoded, postOrderAll);

router.post('/orders/cancel', isAuth, urlEncoded, postCancel);

router.post('/orders/cancelAll', isAuth, postCancelAll);

router.post('/orders/save', isAuth, urlEncoded,
    validator.check('amount').isInt({min: 1}).withMessage('amount must be greater than zero'),
    postSaveOrder);


module.exports = router;
