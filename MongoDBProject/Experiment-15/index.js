const express = require('express');
const { connections } = require('mongoose');
const UserModel = require('./models/usermodels');
const { connection } = require('./config/db');
const app = express();
const port = 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post("/adduser",async(req,res)=>{
    console.log(req.body)
    const {email,password,location} = req.body;
    try {
        const user = new UserModel({email,password,location});
        await user.save();
        res.send('User added successfully');
    } catch (error) {
        res.send(error.message)
    }
})
app.listen(port,async() => {
    try {
        await connection;
        console.log('Connected to the database');
    } catch (error) {
        console.log('Unable to connect server to the database');
        
    }
    console.log(`Server is running on port ${port}`);
});

// module.exports = app;