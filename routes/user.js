const express = require('express');
usersRouter = express.Router();
const db = require('../db/index')

usersRouter.get('/', (req, res, next)=>{
    db.query(
        'SELECT * FROM customers ORDER BY id ASC', 
        (error, results)=>{
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    })
})

usersRouter.get('/:id', (req, res, next)=>{
    const id = parseInt(req.params.id) //this is from the url param

    db.query(
        'SELECT * FROM customers WHERE id = $1', 
        [id], 
        (error, results)=>{
        if(error) {
            throw error;
        }
        res.status(200).json(results.rows); //automaticall parses the results to json
    })
})

usersRouter.post('/', (req, res, next)=>{
    const {id, username, password} = req.body //this is a body, and will pull only variable that have the same name

    db.query(
        'INSERT INTO customers VALUES ($1, $2, $3) RETURNING *',
        [id, username, password],
        (error, results)=>{
        if(error) {
            throw error;
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
});

usersRouter.put('/:id', (req, res, next)=>{
    const id = parseInt(req.params.id)
    const {username, password} = req.body

    db.query(
        'UPDATE customers SET username = $1, password = $2 where id = $3',
        [username, password, id],
        (error, results) => {
            if(error) {
                throw error
            }
            res.status(200).send(`User modified with ID: ${id}`)
        }
    )
})

usersRouter.delete('/:id', (req, res, next)=>{
    const id = parseInt(req.params.id)

    db.query(
        'DELETE FROM customers WHERE id = $1',
        [id],
        (error, results)=>{
            if(error) {
                throw error
            }
            res.status(200).send(`User delete with ID: ${id}`)
        }
    )
})

module.exports = usersRouter;