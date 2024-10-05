const express = require('express');
const router = express.Router();
const {getProduct, getFirstProduct} = require('../controllers/product_controller');

router.get('/product/:id', getProduct);

router.get('/product', getFirstProduct);






module.exports = router;





