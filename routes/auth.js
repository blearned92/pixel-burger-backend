const express = require('express');
authRouter = express.Router();
const db = require('../db/index');
const { getByUsername } = require('../db/user');

authRouter.post('/login', async (req, res)=>{
    if(req.session.user){
        res.status(400).json({message:"User already logged in"})
        return
    }
    const {username, password} = req.body;
    const user = await getByUsername(username);
    if(!user) res.status(403).json({message:`Incorrect username or password`})
    if (user.password === password) {
      req.session.authenticated = true;
      req.session.user = {
        user_id: user.user_id,
        username
      };
      res.status(200).json({ message: `User ${username} successfully logged in` });
    } else {
      res.status(403).json({ message: "Incorrect username or password" });
    }
})

authRouter.post('/logout', (req, res)=>{
    if(!req.session.user){
        res.status(400).json({ message:"No user is currently logged in" })
        return
    }
    req.session.authenticated = false;
    req.session.user = null;
    res.status(200).json({ message: `User successfully logged out` });
})

module.exports = authRouter;