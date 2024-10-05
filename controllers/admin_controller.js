const { validationResult } = require("express-validator");
const Product = require('../models/products_schema');
const Order = require('../models/orders_schema');
const User = require('../models/auth_schema');

const getAdd = (req, res) => {
    res.render('add_product', {
        validationErrors: req.flash('validationErrors'),
        isUser: true,
        isAdmin: true,
        title: 'Add Product'
    })
}

const postAdd = (req, res, next) => {
    console.log(req.file.filename)
    if (validationResult(req).isEmpty()) {
        let product = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: req.file.filename
        })
        product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            next(err);
            // res.redirect('/error');
        })
    } else {
        req.flash('validationErrors', validation.validationResult(req).array());
        res.redirect('/admin/add');
    }
}

const getManage = (req, res) => {
    let status = req.query.status;
    let validStatus = ['pending', 'sent', 'completed'];
    if (validStatus.includes(status)) {
        Order.find({status: status})
        .then((ords) => {
            if (ords) {
                let array = [];
                let promises = ords.map((ord) => {
                    return User.findOne({ _id: ord.userId }, { email: 1 })
                        .then((email) => {
                            Object.assign(ord, { email: email.email });
                            array.push(ord);
                        });
                });

                Promise.all(promises)
                    .then(() => {
                        if(req.query.email) {
                            let orders = array.filter(order => order.email === req.query.email)
                            res.render('manage_orders', {
                                validationErrors: req.flash('validationErrors'),
                                isUser: true,
                                isAdmin: true,
                                orders,
                                title: 'Manage Product'
                            });
                        }
                        else {
                            let orders = array
                            res.render('manage_orders', {
                                validationErrors: req.flash('validationErrors'),
                                isUser: true,
                                isAdmin: true,
                                orders,
                                title: 'Manage Product'
                            });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
        });
    } else {
        Order.find()
        .then((ords) => {
            if (ords) {
                let array = [];
                let promises = ords.map((ord) => {
                    return User.findOne({ _id: ord.userId }, { email: 1 })
                        .then((email) => {
                            Object.assign(ord, { email: email.email });
                            array.push(ord);
                        });
                });

                Promise.all(promises)
                    .then(() => {
                        if(req.query.email) {
                            let orders = array.filter(order => order.email === req.query.email)
                            res.render('manage_orders', {
                                validationErrors: req.flash('validationErrors'),
                                isUser: true,
                                isAdmin: true,
                                orders,
                                title: 'Manage Product'
                            });
                        }
                        else {
                            let orders = array;
                            res.render('manage_orders', {
                                validationErrors: req.flash('validationErrors'),
                                isUser: true,
                                isAdmin: true,
                                orders,
                                title: 'Manage Product'
                            });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
        });

    }
}

const postSave = (req, res) => {
    const id = req.body.orderId;
    Order.findByIdAndUpdate(id, {status: req.body.status})
    .then(() => {
        console.log(1)
        res.redirect('/admin/orders')
    })
    .catch((err) => {
        console.log(err);
    })
}


module.exports = {
    getAdd,
    postAdd,
    getManage,
    postSave
}
