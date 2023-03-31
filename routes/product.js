const express = require('express');
productsRouter = express.Router();
const db = require('../db/index');
const { 
    getAll, 
    getAllBySearchTerm, 
    getById, 
    createProduct, 
    updateProduct,
    deleteById} = require('../db/product');
const {ensureAdminAuthentication} = require('../middleware/auth')

productsRouter.get('/', async (req, res, next)=>{
    const searchTerm = req.query.term;
    if(searchTerm){
        const products = await getAllBySearchTerm(searchTerm);
        res.status(200).send(products);
    } else {
        const products = await getAll();
        res.status(200).send(products);
    }
})

// productsRouter.get('/search', async (req, res, next)=>{
//     console.log(searchTerm)
//     res.send('Get product by term')
// }) //maybe i dont need this one

productsRouter.get('/:id', async (req, res, next)=>{
    const id = parseInt(req.params.id)
    const product = await getById(id);
    if(!product){
        res.status(200).json({product:null})
    } else {
        res.status(200).json(product);
    }
})

productsRouter.post('/', ensureAdminAuthentication, async (req, res, next)=>{
    const product = req.body;
    try {
        await createProduct(product);
        res.status(201).json({message: `Product ${product.product_name} successfully created!`});
    } catch (err) {
        res.status(400).json({message: "Product Object is invalid"});
    }
})

productsRouter.put('/:id', ensureAdminAuthentication, async (req, res, next)=>{
    const id = parseInt(req.params.id);
    const product = req.body
    try {
        const results = await updateProduct(product, id);
        res.status(202).json({message: `Product ${results.rows[0].product_name} successfully updated!`})
    } catch (err) {
        res.status(400).json({message: "Product Object is invalid"});
    }
})

productsRouter.delete('/:id', ensureAdminAuthentication, async (req, res, next)=>{
    const id = parseInt(req.params.id);
    try {
        await deleteById(id)
        res.status(204).send();
    } catch (err) {
        res.status(400).json({message:'Product object could not be found for deletion'})
    }
})

module.exports = productsRouter;