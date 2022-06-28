const express = require('express');
const router = express.Router();

// Custom functions
const { createNewUser, authenticateUser, getUsers } = require("./controller");
const { sendOTPVerificationEmail } = require("../email_verification_otp/controller");

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        let {name, email, password, phone } = req.body; 
        name = name.trim();
        email = email.trim();
        password = password.trim();
        if (name == "" || email == "" || password == "" || phone == "")
            throw Error("Empty fields");
        else if (!/^[a-zA-Z א-ת]*$/.test(name)) 
            throw Error("Invalid name");
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) 
            throw Error("Invalid email");
        else if (password.length < 8) 
            throw Error("password is too short!");
        else if (phone.length == 9)
            throw Error("Invalid phone number");
        else {
           //valid credentials
            const newUser = await createNewUser({
                name,
                email,
                password,
                phone
            });
            const emailData = await sendOTPVerificationEmail(newUser);
            res.json({
                status: "PENDING",
                message: "Verification email sent",
                data: emailData, 
            });
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });     
    }
})

// Sign In
router.post('/signin', async (req, res) => {
    try {
        let {email, password} = req.body;
        email = email.trim();
        password = password.trim();
        if (email == "" || password == "") 
            throw Error("Empty fields"); 
        const authenticatedUser = await authenticateUser(email, password);
        res.json({
            status: "SUCCESS",
            message: "Signin successfully",
            data: authenticatedUser, 
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})

// Get Users
router.post('/getUsers', async (req, res) => {
    try {
        const users = await getUsers();
        res.json({
            status: "SUCCESS",
            message: "Get Users successfully",
            data: users, 
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });   
    }
})

module.exports = router;