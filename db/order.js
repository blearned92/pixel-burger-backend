const db = require('./index')

const getByUserId = async id => {
    return await db
        .query('SELECT * FROM orders ' + 
            'JOIN order_items ON orders.order_id = order_items.order_id ' +
            'JOIN products ON order_items.product_id = products.product_id ' +
            'where user_id = $1',
            [id])
        .then(response=>response.rows)
}

const createOrder = async id => {
    return db
        .query('INSERT INTO orders (user_id) VALUES ($1)', [id])
        .then(response=>response.rows)
}

const deleteByOrderId = async id => {
    return db
        .query(
            'DELETE FROM orders WHERE order_id = $1', 
            [id]
        )
}

module.exports = {
    getByUserId,
    createOrder,
    deleteByOrderId
}