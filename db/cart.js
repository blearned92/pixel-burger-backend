const express = require('express');
const db = require('./index')

const getAllById = async id => {
    return await db
        .query(
            'SELECT products.product_id, qty, product_name, product_price, product_img_url, product_description, (product_price * qty) as total_price FROM users ' + 
            'JOIN cart_items ON users.user_id = cart_items.user_id ' +
            'JOIN products ON products.product_id = cart_items.product_id ' +
            'WHERE users.user_id = $1',
            [id]
        )
        .then(response=>response.rows)
}

const addToCart = async (cartItem) => {
    const {user_id, product_id, qty} = cartItem;
    console.log(user_id, product_id, qty)
    return db
        .query(
            'INSERT INTO cart_items VALUES ($1, $2, $3)',
            [parseInt(user_id), 
            parseInt(product_id),
            parseInt(qty)]
        )
}

//update item quantity in cart
const updateCartItem = async (cartItem) => {
    const {user_id, product_id, qty} = cartItem;
    // console.log("Delete cart of user " + id)
    return db
    .query(
        'UPDATE cart_items SET qty = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [qty,
        user_id, 
        product_id]
    )  
}

const deleteCart = (id) => {
    console.log("Delete cart of user " + id)
    return db
    .query(
        'DELETE FROM cart_items WHERE user_id = $1',
        [id]
    )  
}

const deleteProduct = (id, productId) => {
    console.log("Delete product " + productId + " from cart of user " + id)
    return db
        .query(
            'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [id, 
            productId]
        )
}

module.exports = {
    getAllById,
    addToCart,
    updateCartItem,
    deleteCart,
    deleteProduct
}
