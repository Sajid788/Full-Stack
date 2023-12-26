const {Router} = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {UserModel} = require("../models/User.model")


const userController = Router();

userController.post("/signup", async (req, res) => {
    const { email, password, age, username } = req.body;
    if (!username) {
        return res.status(400).send("Username is required");
    }

    bcrypt.hash(password, 5, async function (err, hash) {
        if (err) {
            return res.send("Something went wrong, please try again later");
        }

        const user = new UserModel({
            email,
            password: hash,
            age,
            username, 
        });

        try {
            await user.save();
            res.json({mag:"Signup successful"});
        } catch (error) {
            console.log("Something went wrong, please try again later");
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    });
});

userController.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.send("Invalid credentials");
    }
    bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
            return res.send("Something went wrong, please try again later");
        }
        if (result) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            return res.send({ message: "Login successful", token });
        } else {
            return res.send("Invalid credentials");
        }
    });
});


module.exports = {userController}