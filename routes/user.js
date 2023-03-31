const express = require('express');
usersRouter = express.Router();
const db = require('../db/index');
const bcrypt = require('bcrypt'); //used for encrypting passwords
const { 
    getAll, 
    getById, 
    createUser, 
    updateUser, 
    deleteById } = require('../db/user');
const {ensureAdminAuthentication, ensureAuthentication, ensureIdOrAdminAuth} = require('../middleware/auth')

usersRouter.get('/', ensureAdminAuthentication, async (req, res, next)=>{
    console.log(req.session.user)
    const users = await getAll();
    res.status(200).send(users);
})

usersRouter.get('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res, next)=>{
    const id = parseInt(req.params.id) //this is from the url param
    const user = await getById(id);
    if(!user){
        res.status(200).json({user:null})
    } else if(id === req.session.user.user_id || req.session.user.username === 'blearned92'){
        res.status(200).send(user);
    } else {
        res.status(400).json({message:"You're not authorized to view this information"})
    }
})

usersRouter.post('/', async (req, res, next)=>{
    const newUser = req.body //this is a body, and will pull only variable that have the same name
    try {
        await createUser(newUser);
        res.status(201).json({message: `User ${newUser.username} successfully created!`});
    } catch (err) {
        res.status(400).json({message: "Username Taken"});
    }
});

usersRouter.put('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res, next)=>{
    const id = parseInt(req.params.id)
    const user = req.body
    try {
        const results = await updateUser(user, id);
        res.status(202).json({message: `User ${results.rows[0].username} successfully updated!`})
    } catch (err) {
        res.status(400).json({message: "User Object is invalid"});
    }
})

usersRouter.delete('/:id', [ensureAuthentication, ensureIdOrAdminAuth], async (req, res, next)=>{
    const id = parseInt(req.params.id)
    try {
        await deleteById(id)
        res.status(204).send();
    } catch (err) {
        res.status(400).json({message:'User object could not be found for deletion'})
    }
    
})

module.exports = usersRouter;