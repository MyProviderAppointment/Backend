const express = require('express');
const router = express.Router();

// Custom functions
const { createNewUser, authenticateUser } = require("./controller");
const { sendOTPVerificationEmail } = require("../email_verification_otp/controller");

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        let {name, email, password } = req.body; // dateOfBirth
        name = name.trim();
        email = email.trim();
        password = password.trim();
        // phone = phone.trim();
        // dateOfBirth = dateOfBirth.trim();

        if (name == "" || email == "" || password == "" ) // || dateOfBirth == "") 
            throw Error("Empty fields");

        else if (!/^[a-zA-Z א-ת]*$/.test(name)) 
            throw Error("Invalid name");

        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) 
            throw Error("Invalid email");

        // else if (!new Date(dateOfBirth).getTime()) 
        //     throw Error("Invalid date of birth");

        else if (password.length < 8) 
            throw Error("password is too short!");

        else {
           //valid credentials
            const newUser = await createNewUser({
                name,
                email,
                password,
                // dateOfBirth,
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

module.exports = router;