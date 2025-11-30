const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

//import model
const User = require('./models/user');
const Transaction = require('./models/transaction');

const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(bodyParser.json());

//Db connection
const MONGO_URL = 'mongodb+srv://alsdei:iloveyaoih3h3.@dexcluster.eqqgj9w.mongodb.net/FPSeCuan?appName=DexCluster'

mongoose.connect(MONGO_URL).then(() => console.log('MongoDB Connected to the server')).catch(err => console.log('DB Connection failed'));

// -- API --
// registration
app.post('/api/register', async (req,res) => {
    const { username, email, password} = req.body;

    try{
        const userExist = await User.findOne({ email });
        if(userExist)
        {
            return res.status(400).json({success: false, message: 'Email already exist'});
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.json({success : true, message: 'User Registered', user: { username, email}});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error'});
    }
})

// login method
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email, password });
        if(!user)
        {
            return res.status(400).json({success : false, message: 'invalid credentials!!'});
        }
        res.json({ success: true, message: 'Login Successful', user: { username: user.username, email: user.email }});
    } catch(error)
    {
        res.status(500).json({ success: false, message: 'Server Error'});
    }
});

app.post('/api/transaction', async (req, res) =>{
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.json({ success: true, message: 'Top-Up Successful!'});
    }catch(error){
        res.status(500).json({ success: false, message: 'Transaction failed' });
    }
});

//server starto
app.listen(PORT, () =>{
    console.log('Server runnning on http://localhost:' + PORT);
});