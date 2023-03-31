const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');

//router imports
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/user');
const productsRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/order');

const createServer = () => {
    const app = express();
    const store = new session.MemoryStore();
    app.use(
        session({
          secret: "f4z4gs$Gcg",
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

    return app;
}

module.exports = {createServer};