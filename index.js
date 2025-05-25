const express = require('express');
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
const { auth, JWT_SECRET } = require('./authMW');
const mongoose = require('mongoose');
const { UserModel, TodoModel } = require('./db');
mongoose.connect("mongodb+srv://bhanuprasad03:Bhanu08102005@cluster0.zrvybt7.mongodb.net/my-todo-app").then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ DB Connection Error:", err));


app.post('/signup', async function (req, res) {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            name: name,
            username: username,
            password: password
        })
        res.json({
            message: "You are Signed Up"
        })
    } catch (err) {
        res.json({
            message: "Error"
        })
    }


})

app.post('/signin', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const response = await UserModel.findOne({
        username: username,
        password: password
    })

    if (response) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);
        res.json({
            token
        })
    } else {
        res.statusCode(403).json({
            message: "Incorrect Credentials"
        })
    }
})


app.post('/todo', auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const status = req.body.status;
    try {
        await TodoModel.create({
            userId:userId,
            title: title,
            status: status
        })
        res.json({
            userId: userId
        })
    } catch (err) {
        res.json({
            message: "Error"
        })
    }

})

app.get('/todos', auth, async function (req, res) {
    const userId = req.userId;
    try {
        const todos = await TodoModel.find({ userId }).lean(); 
        res.json({ todos });
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ message: "Failed to fetch todos" });
    }
});

app.listen(3000, () => {
    console.log('✅ Server is running on http://localhost:3000');
});