const express = require('express');
const path = require('path')
const mongoose = require('mongoose');

const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const app = express();
const homeRouter = require('./routes/home_route')
const productRouter = require('./routes/product_route');
const authRouter = require('./routes/authroutes');
const cartRouter = require('./routes/cart_route');
const orderRouter = require('./routes/odrers_route');
const adminRouter = require('./routes/admin_route');
const { error } = require('console');

//const connectToDb = require('./models/db');

const uri = 'mongodb://localhost:27017/online-shop';
mongoose.connect(uri)
    .then((conn) => {
        console.log(`Database connected: ${conn.connection.host}`);
        app.listen(3000, () => {
            console.log('Server listening on port 3000');
        })
    }).catch((error) => {
        console.log(error);
}) 
//connectToDb();

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(flash());

const STORE = new SessionStore({
    uri: 'mongodb://localhost:27017/online-shop',
    collection: 'sessions'
})

app.use(session({
    secret: 'this is my secret secret to hash express sessions ......',
    //resave: false,
    saveUninitialized: false,
    store: STORE,
}))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', homeRouter);
app.use('/', productRouter);
app.use('/', authRouter);
app.use('/', cartRouter);
app.use('/', orderRouter);
app.use('/', adminRouter);

app.get('/error', (req, res) => {
    res.status(500);
    res.render('error', {
        isUser: true,
        isAdmin: true
    })
})

// app.use((error, req, res, next) => {
//     res.redirect('/error')
// })

app.get('/not_admin', (req, res) => {
    res.status(403);
    res.render('not_admin', {
        isUser: req.session.userId,
        isAdmin: false
    })
})









