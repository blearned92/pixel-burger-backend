const express = require('express');
cartRouter = express.Router();
const db = require('../db/index');
const {
    getAllById, 
    addToCart,
    updateCartItem,
    deleteProduct,
    deleteCart} = require('../db/cart');
const {ensureAuthentication, ensureIdOrAdminAuth} = require('../middleware/auth')

cartRouter.get('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res)=>{
    const id = parseInt(req.params.id); 
    const cart = await getAllById(id);
    res.status(200).json({user_id: id, cart});
})

cartRouter.post('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res)=>{
    const cartItem = req.body;
    try {
        const results = await addToCart(cartItem);
        res.send("Success")
    } catch (err) {
        res.status(400).json({message: "Cart Object is invalid"});
    }
})

cartRouter.put('/', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res)=>{
    const cartItem = req.body;
    try {
        const results = await updateCartItem(cartItem);
        res.send("Success")
    } catch (err) {
        res.send("Error")
    }
});

cartRouter.delete('/:id', [ensureAuthentication, ensureIdOrAdminAuth], (req, res)=>{
    const userId = parseInt(req.params.id);
    const productId = parseInt(req.query.product);

    if(productId){
        deleteProduct(userId, productId);
        res.status(204).send();
    } else {
        deleteCart(userId);
        res.status(204).send();
    }
});

module.exports = cartRouter;