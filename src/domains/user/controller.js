const User = require("./model");
const hashData = require("../../util/hashData");
const verifyHashedData = require("../../util/verifyHashedData");

// Sign Up
const createNewUser = async (data) => {
    try {
        const { name, email, password, phone } = data;  
        // Checking if user already exist
        const existingUser = await User.find({ email });
        if (existingUser.length) 
            throw Error("user already exists");
        else {     
            // hash password
            const hashedPassword = await hashData(password);
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                phone,
                verified: false,
            });   
            // save user
            const createdUser = await newUser.save();
            return createdUser;
        }
    } catch (error) {
        throw error;
    }
};

// Sign In
const authenticateUser = async (email, password) => {
    try {
        const fetchedUsers = await User.find({ email });
        if (!fetchedUsers.length) 
            throw Error("Invalid credentials entered!");
        else {
            if (!fetchedUsers[0].verified) 
                throw Error("Email hasn't been verified yet. Check your inbox.");
            else {
                const hashedPassword = fetchedUsers[0].password;
                const passwordMatch = await verifyHashedData(password, hashedPassword);
                if (!passwordMatch) 
                    throw Error("Invalid password entered!");
                else { return fetchedUsers; }
            }
        }
    } catch (error) {
        throw error;
    }
};

// Get Users
const getUsers = async () => {
    try {
        const users = await User.find();
        // Check if specific day is exists
        // if (users.length > 0) { 
            console.log(users[0]);

            const array = users; 
            let arr = [];
            // // Check if appointment time is available
            for (let index = 0; index < array.length; index++) {
                if (array[index].verified) {
                    arr.push({
                        index: index,
                        email: array[index].email,
                        name: array[index].name,
                        phone: array[index].phone,
                    });  
                }             
            }
            return arr;
        // }
    } catch (error) {
        throw error;
    }
};
module.exports = { createNewUser, authenticateUser ,getUsers };