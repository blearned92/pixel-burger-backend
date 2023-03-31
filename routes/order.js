const express = require('express');
ordersRouter = express.Router();
const db = require('../db/index');
const { getByUserId, createOrder, deleteByOrderId } = require('../db/order');
const {ensureAdminAuthentication, ensureAuthentication, ensureIdOrAdminAuth} = require('../middleware/auth')

ordersRouter.get('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res) => {
    const id = parseInt(req.params.id);
    const orders = await getByUserId(id);
    res.status(200).json(orders);
})

ordersRouter.post('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res) => {
    const id = parseInt(req.params.id);
    const order = await createOrder(id);
    res.status(201).json(order);
})

ordersRouter.delete('/:id', ensureAdminAuthentication, async (req, res)=>{
    const id = parseInt(req.params.id);
    try {
        await deleteByOrderId(id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({message:'Order object could not be found for deletion'})
    }
})

module.exports = ordersRouter;