const express = require('express');
const router = express.Router();

const { createNewWorkDay, makeAnAppointment, cancelAppointment, getAvailableDays, 
    getAppointments, getMyAppointments, getCalendar } = require("./controller");

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

// Get Available Days
router.post('/getAvailableDays', async (req, res) => {
    try {
        let {slot_month} = req.body;
        if (!slot_month)
            throw Error("Empty fields are not allowed");
        else {
            const DayRecords = await getAvailableDays({ slot_month });
            if (DayRecords.length > 0) {
                res.json({
                    status: "SUCCESS",
                    message: `This date are available.`,
                    data: { DayRecords },
                }); 
            } else { 
                res.json({
                    status: "EMPTY",
                    message: `No appointments for this date.`,
                }); 
            }   
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// Get Appointments
router.post('/getAppointments', async (req, res) => {
    try {
        let {slot_date} = req.body;
        if (!slot_date)
            throw Error("Empty fields are not allowed");
        else if (new Date(slot_date) < Date.now()) 
            throw Error("Invalid date");
        else {
            const AppointmentsRecords = await getAppointments({ slot_date });
            if (AppointmentsRecords.length > 0) {
                res.json({
                    status: "SUCCESS",
                    message: `Successfully get appointments.`,
                    data: { AppointmentsRecords },
                }); 
            } else {
                res.json({
                    status: "EMPTY",
                    message: `No appointments for this date.`,
                }); 
            }   
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// Get My Appointments
router.post('/getMyAppointments', async (req, res) => {
    try {
        let {email} = req.body;
        if (!email)
            throw Error("Empty fields are not allowed");
        else {
            const MyAppointmentsRecords = await getMyAppointments({ email });
            if (MyAppointmentsRecords.length > 0) {
                res.json({
                    status: "SUCCESS",
                    message: `This date are available.`,
                    data: { MyAppointmentsRecords },
                }); 
            } else { 
                res.json({
                    status: "EMPTY",
                    message: `No appointments for this date.`,
                }); 
            }   
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

router.post('/getCalendar', async (req, res) => {
    try {
        let {slot_time} = req.body;
        if (!slot_time)
            throw Error("Empty fields are not allowed");
        else {
            const DaysRecords = await getCalendar({ slot_time });
            if (DaysRecords.length > 0) {
                res.json({
                    status: "SUCCESS",
                    message: `This date are available.`,
                    data: { DaysRecords },
                }); 
            } else { 
                res.json({
                    status: "EMPTY",
                    message: `No appointments for this date.`,
                }); 
            }   
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
})

// router.post('/makeService', async (req, res) => {})
// router.post('/getServices', async (req, res) => {})
// router.post('/getImages', async (req, res) => {})

module.exports = router;
