const Order = require('../models/orders_schema');
const validator = require('express-validator');
const Cart = require('../models/cart_model');



const getOrders = (req, res) => {
    Order.find({userId: req.session.userId})
    .then((orders) => {
        res.render('orders', {
            orders,
            isUser: true,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0],
            title: 'Orders'
        });
    }).catch((error) => {
        console.log(error)
    })
}

const postOrders = (req, res) => {
    if(validator.validationResult(req).isEmpty()) {
        Cart.findById(req.body.cartId)
        .then((cart) => {
            const date = new Date();
            const order = new Order({
                cartId: cart._id,
                userId: req.session.userId,
                name: cart.name,
                amount: cart.amount,
                cost: cart.price * cart.amount,
                address: req.body.address,
                status: 'pending',
                time: date.toLocaleString(),
                email: req.session.email
            })
            order.save()
            .then(() => {
                res.redirect('/orders')
            })
            .catch((error) => {
                console.log(error);
            })
        })
    } else {
        req.flash('validationErrors', validator.validationResult(req).array());
        res.redirect('/cart/orders');
    }
}

const postOrderAll = (req, res, next) => {
    if(Array.isArray(req.body.cartId)) {
        Cart.find({ userId: req.session.userId })
        .then((carts) => {
            const orderPromises = [];

            for (let i = 0; i < carts.length; i++) {
                const cart = carts[i];
                const order = new Order({
                    name: cart.name,
                    amount: cart.amount,
                    cost: cart.price * cart.amount,
                    address: req.body.address,
                    status: "pending",
                    time: new Date().toLocaleString(),
                    userId: req.session.userId,
                    cartId: cart._id,
                    email: req.session.email
                });

                orderPromises.push(order.save());
            }

            return Promise.all(orderPromises);
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((error) => {
            console.error("Error saving orders:", error);
            // Handle the error (e.g., send an error response or redirect).
            // You might want to add a flash message to inform the user.
        });
    } else {
        postOrders(req, res);
    }
    
};




const postSaveOrder = (req, res) => {
    if(validator.validationResult(req).isEmpty()) {
        Cart.findById(req.body.cartId)
        .then((cart) => {
            Order.updateOne({_id: req.body.orderId},
                {amount: req.body.amount, time: new Date().toLocaleString(), cost: cart.price * req.body.amount})
                .then(() => {
                    res.redirect('/orders');
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        
    } else {
        req.flash('validationErrors', validator.validationResult(req).array());
        res.redirect('/orders')
    }
}


const postCancel = (req, res) => {
    Order.findByIdAndDelete(req.body.orderId)
    .then(() => {
        res.redirect('/orders')
    })
    .catch((error) => {
        console.log(error);
    })
}

const postCancelAll = (req, res) => {
    Order.deleteMany({userId: req.session.userId, status: 'pending'})
    .then(() => {
        res.redirect('/orders')
    })
    .catch((error) => {
        console.log(error);
    })
}


module.exports = {
    getOrders,
    postOrders,
    postCancel,
    postCancelAll,
    postSaveOrder,
    postOrderAll
}






