const express = require('express');
const router = express.Router();
const {isAuth} = require('./guards/auth-guard');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const {postCart, getCart,
    postSave, postDelete,
    postDeleteAll, postOrder, postOrderAll} = require('../controllers/cart_controller');

const urlEncoded = bodyParser.urlencoded({extended: true});

router.get('/cart', isAuth, getCart)

router.post('/cart', isAuth, urlEncoded, 
    validator.check('amount').not().isEmpty().withMessage('amount is required')
    .isInt({min: 1}).withMessage('amount must be greater than zero'),
    postCart
);

router.post('/cart/save', isAuth, urlEncoded, 
    validator.check('amount').not().isEmpty().withMessage('amount is required')
    .isInt({min: 1}).withMessage('amount must be greater than zero'),
    postSave
)

router.post('/cart/delete', isAuth, urlEncoded, postDelete);

router.post('/cart/deleteAll', isAuth, postDeleteAll);

router.post('/cart/order', isAuth, urlEncoded, postOrder);

router.post('/cart/orderAll', isAuth, urlEncoded, postOrderAll);


module.exports = router;