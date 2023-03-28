const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

//router imports
const usersRouter = require('./routes/user');

//port listening
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})

//add middleware
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({extended:true})
)

//routes
app.get('/', (req, res)=>{
    res.json({info: 'server.js, Express, and Postgres API'})
})

app.use('/users', usersRouter);