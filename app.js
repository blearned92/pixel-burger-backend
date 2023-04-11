const express = require('express');
const session = require("express-session");
const flash = require('express-flash')
const bodyParser = require('body-parser');
require('dotenv').config() //pulls all .env file variables


//router imports
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/user');
const productsRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/order');

const createServer = () => {
    //server configuration
    const app = express();
    const store = new session.MemoryStore();
    // const passport = require('passport');
    // const initializePassport = require('./passport-config');
    // initializePassport(passport);
    app.use(flash());
    app.use(
        session({
          secret: process.env.SESSION_SECRET,
          cookie: { maxAge: 300000000, secure: false },
          saveUninitialized: false,
          resave: false,
          store,
        })
    );
    
    //add middleware
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({extended:true})
    )
    
    //setRoutes
    app.use('/', authRouter);
    app.use('/users', usersRouter);
    app.use('/products', productsRouter);
    app.use('/cart', cartRouter);
    app.use('/orders', ordersRouter);

    app.get('/', (req, res)=>{
        res.status(200).json({message: "Welcome!"})
    })
      
    return app;
}

module.exports = {createServer};