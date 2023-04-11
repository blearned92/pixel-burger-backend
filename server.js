const {createServer} = require('./app')

const app = createServer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})