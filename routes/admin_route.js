const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const multer = require('multer');
const bodyParser = require('body-parser');

const urlEncoded = bodyParser.urlencoded({extended: true});

const {getAdd, postAdd, getManage, postSave} = require('../controllers/admin_controller');
const adminGuard = require('./guards/admin_guard');

router.get('/admin/add', adminGuard, getAdd);

router.post('/admin/add', adminGuard, 
    multer({storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image'),
    check('image').custom((value, {req}) => {
    if(req.file) {
        return true
    } else {
        throw 'image is required'
    }
})
, urlEncoded, postAdd);

router.get('/admin/orders', adminGuard, getManage);

router.post('/admin/save', adminGuard, urlEncoded,
    check('email').not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid format')
    ,postSave);


module.exports = router;






