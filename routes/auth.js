const express = require('express');
authRouter = express.Router();
const bcrypt = require('bcrypt'); //used for encrypting passwords
const { getByUsername, createUser } = require('../db/user');


//login needs to compare passwords with hashed passwords using bcrypt
authRouter.get('/', (req, res)=>{
  res.send("Welcome!")
})

authRouter.post('/login', async (req, res)=>{
    if(req.session.user){
        res.status(400).json({message:"User already logged in"})
        return
    }
    try {
      const {username, password} = req.body;
      const user = await getByUsername(username);
      if(!user) {
        res.status(403).json({message:`Incorrect username or password`})
      } else {
        if(await bcrypt.compare(password, user.password)) {
          req.session.authenticated = true;
          req.session.user = {
            user_id: user.user_id, 
            username,
            user_type: user.user_type
          };
          res.status(200).json({ message: `User ${username} successfully logged in` });
        } else {
          res.status(403).json({message:`Incorrect username or password`})
        }
      }
    } catch (e) {
      res.status(403).json({ message: "Something went wrong" });
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


//the hashing should probably go here, and then pass in the hashed password
authRouter.post('/register', async (req, res)=>{
  const newUser = req.body //this is a body, and will pull only variable that have the same name
  const hashedPassword = await bcrypt.hash(newUser.password, 10); //hash the password and store in variable
  newUser.password = hashedPassword;
  console.log(newUser);
  try {
      await createUser(newUser);
      res.status(201).json({message: `User ${newUser.username} successfully created!`});
  } catch (err) {
      res.status(400).json({message: "Username Taken"});
  }
});

module.exports = authRouter;