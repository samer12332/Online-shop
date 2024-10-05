const Product = require('../models/products_schema');


const getHome = (req, res) => {
    //console.log(req.session.userId);
    let category = req.query.category;
    let validCategories = ["clothes", "phones", "computers", "test"]

    if (category == 'all' || !validCategories.includes(category)) {
        Product.find().then((products) => {
            res.render('index', {
                products,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                validationErrors: req.flash('validationErrors')[0],
                title: 'Home'
            });
        }).
        catch((error) => {
            console.log(error);
        })
    } else if( validCategories.includes(category)) {
        Product.find({category: `${req.query.category}`}).
        then((products) => {
            res.render('index', {
                products,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                validationErrors: req.flash('validationErrors')[0],
                title: 'Home'
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }
}




module.exports = {getHome};

