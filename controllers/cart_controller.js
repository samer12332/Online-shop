const Cart = require('../models/cart_model');
const validator = require('express-validator');
const User = require('../models/auth_schema');

const getCart = (req, res) => {
    Cart.find({userId: req.session.userId}, {}, {sort: {timestamp: 1}})
    .then((items) => {
        res.render('cart', {
            items, isUser: true,
            validationErrors: req.flash('validationErrors')[0],
            isAdmin: req.session.isAdmin,
            title: 'Cart'
        })
    })
    .catch((error) => {
        console.log(error);
    })
}



const postCart = (req, res) => {
    if(validator.validationResult(req).isEmpty()) {
        Cart.findOne({productId: req.body.productId, userId: req.session.userId})
        .then((product) => {
            console.log(1);
            if(product) {
                console.log(2);
                Cart.updateOne({productId: req.body.productId, userId: req.session.userId}, {amount: parseInt(product.amount) + parseInt(req.body.amount)})
                .then((updated) => {
                    console.log(updated)
                    res.redirect('/cart');
                    console.log(3);
                })
            } else {
                console.log(4);
                let cart = new Cart({
                    name: req.body.name,
                    price: req.body.price,
                    amount: req.body.amount,
                    productId: req.body.productId,
                    userId: req.session.userId,
                    timestamp: Date.now()
                })
                console.log(5);
                cart.save()
                .then(() => {
                    res.redirect('/cart')
                }).catch((error) => {
                    console.log(error)
                })
            }
        })
    } else {
        req.flash('validationErrors', validator.validationResult(req).array());
        res.redirect(req.body.redirectTo);
    }
}

const postSave = (req, res) => {
    if (validator.validationResult(req).isEmpty()) {
        Cart.updateOne({_id: req.body.cartId},
            {amount: req.body.amount, timestamp: Date.now()})
            .then(() => {
                res.redirect('/cart')
            })
            .catch((error) => {
                console.log(error);
            })
    } else {
        req.flash('validationErrors', validator.validationResult(req).array());
        //res.render('/cart', {validationErrors: req.flash('validationErrors')[0]});
        res.redirect('/cart');
    }
}

const postDelete = (req, res) => {
    Cart.findByIdAndDelete(req.body.cartId)
    .then(() => {
        res.redirect('/cart')
    })
    .catch((err) => {
        console.log(err);
    })
}


const postDeleteAll = (req, res) => {
    Cart.deleteMany({userId: req.session.userId})
    .then(() => {
        res.redirect('/cart')
    })
    .catch((error) => {
        console.log(error);
    })
}

// const postVerify = (req, res) => {
//     Cart.render()
// }

const postOrder = (req, res) => {
    Cart.find({_id: req.body.cartId})
    .then((orders) => {
        res.render('verifyOrder', {isUser: true, orders, isAdmin: req.session.isAdmin, title: 'VerifyOrder'});
    })
    .catch((err) => {
        console.log(err)
    })
}

const postOrderAll = (req, res) => {
    Cart.find({userId: req.session.userId})
    .then((orders) => {
        res.render('verifyOrder', {isUser: true, orders, isAdmin: req.session.isAdmin, title: 'VerifyOrder'});
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = {
    postCart,
    getCart,
    postSave,
    postDelete,
    postDeleteAll,
    postOrder,
    postOrderAll
}