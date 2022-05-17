const express = require('express');
const router = express.Router();

const { createNewWorkDay, makeAnAppointment, cancelAppointment , getAppointments } = require("./controller");

// Create Work Day and availability
router.post('/providerAppointments', async (req, res) => {
    try {
        let {slot_date, slot_start, slot_end, spacious} = req.body;
        
        if (!slot_date || !slot_start || !slot_end || !spacious)
            throw Error("Empty fields are not allowed");
        
        else if (new Date(slot_date) < Date.now()) 
            throw Error("Invalid date");
        
        else {
            const AppointmentsRecords = await createNewWorkDay({
                slot_date, 
                slot_start, 
                slot_end, 
                spacious,
            });

            res.json({
                status: "SUCCESS",
                message: `Successfully made provider appointments.`,
            });     
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// Make an Appointment for customer
router.post('/makeAnAppointment', async (req, res) => {
    try {
        let { slot_date, slot_start, email, userId, name, phone } = req.body;
        
        if (!slot_date || !slot_start ) {
            if (!email && (!name || !phone))
                throw Error("Empty fields are not allowed");
        }
        else if (new Date(slot_date) < Date.now()) 
            throw Error("Invalid date");
        
        else {
            const AppointmentsRecords = await makeAnAppointment({
                slot_date, 
                slot_start, 
                email, 
                userId,
                name, 
                phone,
            });

            res.json({
                status: "SUCCESS",
                message: `Successfully made specific appointment.`,
                data: { AppointmentsRecords },
            });     
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// Cancel Appointment
router.post('/cancelAppointment', async (req, res) => {
    try {
        let {slot_date, slot_start} = req.body;
        if (!slot_date || !slot_start )
            throw Error("Empty fields are not allowed");
        else if (new Date(slot_date) < Date.now()) 
            throw Error("Invalid date");
        else {
            const AppointmentsRecords = await cancelAppointment({
                slot_date, 
                slot_start,   
            });
            res.json({
                status: "SUCCESS",
                message: `Successfully cancel appointment.`,
            });     
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// Get Appointments
router.get('/getAppointments', async (req, res) => {
    try {
        let {slot_date} = req.body;      
        if (!slot_date)
            throw Error("Empty fields are not allowed");
        
        else if (new Date(slot_date) < Date.now()) 
            throw Error("Invalid date");
        
        else {
            const AppointmentsRecords = await getAppointments({
                slot_date, 
            });
            res.json({
                status: "SUCCESS",
                message: `Successfully get appointments.`,
                data: {
                    AppointmentsRecords,
                }
            });     
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

module.exports = router;
