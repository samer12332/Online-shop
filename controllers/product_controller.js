const Product = require('../models/products_schema');

const getProduct = (req, res) => {
    const id = req.params.id;
    Product.findOne({_id: id})
    .then((product) => {
        res.render('product', {
            product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationError: req.flash('validationErrors')[0]});
    }).catch((error) => {
        console.log(error);
    })
}

const getFirstProduct = (req, res) => {
    Product.findOne()
    .then((product) => {
        res.render('product', {product,
            isUser: req.session.userId,
            validationError: req.flash('validationErrors')[0]});
    })
    .catch((error) => {
        console.log(error);
    })
}

module.exports = {
    getProduct,
    getFirstProduct
}