const { response } = require('express');
const express = require('express');
usersRouter = express.Router();
const db = require('./index')

const getAll = async () => {
    return await db
        .query('SELECT * FROM products')
        .then(response=>response.rows)
}

const getAllBySearchTerm = async (searchTerm) => {
    searchTerm = '%' + searchTerm + '%';
    console.log(searchTerm)
    return await db
        .query(
            'SELECT * FROM products WHERE LOWER(product_name) LIKE $1',
            [searchTerm]
        )
        .then(response=>response.rows)
}

const getById = async id => {
    return await db
        .query(
            'SELECT * from products WHERE product_id = $1',
            [id]
        )
        .then(response=>response.rows[0])
}

const createProduct = async product => {
    const {product_name, product_price, product_img_url, product_description} = product;
    return db 
        .query(
            'insert into products (product_name, product_price, product_img_url, product_description) VALUES ($1, $2, $3, $4) RETURNING *',
            [product_name, product_price, product_img_url, product_description]
        )
}

const updateProduct = async (product, id) => {
    const {product_name, product_price, product_img_url, product_description} = product;
    return db
        .query(
            'UPDATE products SET product_name = $1, product_price = $2, product_img_url = $3, product_description = $4 WHERE product_id = $5 RETURNING *',
            [product_name, 
            product_price, 
            product_img_url,
            product_description,
            id]
        )
}

const deleteById = async id => {
    return db
        .query(
            'DELETE FROM products WHERE product_id = $1',
            [id]
        )
}

//delete product if admin

module.exports = {
    getAll,
    getAllBySearchTerm,
    getById,
    createProduct,
    updateProduct,
    deleteById
}