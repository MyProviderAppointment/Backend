const Appointments = require("./model");
const moment = require("moment");
const User = require("../user/model");

// Create Work Day and availability
const createNewWorkDay = async (data) => {
    try {
        const { slot_date, slot_start, slot_end, spacious } = data;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const day = new Date(slot_date).toLocaleDateString(undefined, options);
        let startTime = moment(slot_start, 'HH:mm');
        let endTime = moment(slot_end, 'HH:mm');
        while (startTime < endTime) {
            const newAppointments = new Appointments({
                slot_date: day,
                slot_time: [{
                    slot_start: new moment(startTime).format('HH:mm'),
                    available: true,
                }],  
            });
            const existingDay = await Appointments.find({ slot_date: newAppointments.slot_date });
            // Check if appointmet day is already exists
            if (existingDay.length > 0) { 
                let exists = false;
                const array = existingDay[0].slot_time; 
                // Check if appointmet time is already exists
                for (let index = 0; index < array.length; index++) {
                    if (array[index].slot_start == newAppointments.slot_time[0].slot_start) {
                        console.log(newAppointments.slot_time[0].slot_start, ' exists');
                        exists = true;
                    }
                }
                // if not exist, push appointment
                if (!exists) {
                    await Appointments.updateOne(
                        {_id: existingDay[0]._id}, 
                        {$push: {slot_time: [{
                            slot_start: new moment(startTime).format('HH:mm'),
                            available: true,
                        }], }}    
                    );
                }
            // save day
            } else { const createdAppointments = await newAppointments.save(); }
            startTime.add(spacious, 'minutes');
        }
    } catch (error) {
        throw error;
    }
};
    
// Make an Appointment for customer
const makeAnAppointment = async (data) => {
    try {
        const { slot_date, slot_start, email, userId, name, phone } = data;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const day = new Date(slot_date).toLocaleDateString(undefined, options);
        const startTime = new moment(moment(slot_start, 'HH:mm')).format('HH:mm');
        const userDetails = await User.find({ email });
        const updateAppointment = await Appointments.find({ 
            slot_date: day}, 
            {slot_time: {$elemMatch: {slot_start: startTime}}
        });
        if (updateAppointment.length > 0 && updateAppointment[0].slot_time[0].available) { 
            if (userDetails.length > 0) {
                await Appointments.updateOne({   
                    "slot_date": day, 
                    "slot_time._id": updateAppointment[0].slot_time[0]._id
                }, { 
                    "$set": {
                        "slot_time.$.available": false,
                        "slot_time.$.email": email,
                        "slot_time.$.userId": userDetails[0]._id,
                        "slot_time.$.name": userDetails[0].name,
                        "slot_time.$.phone": userDetails[0].phone,
                    } 
                });
                const updateUser = await User.updateOne({ email }, { 
                    "$push": { "appointments": [
                        {
                            "slot_date": day, 
                            "slot_start": updateAppointment[0].slot_time[0].slot_start,
                            _id: updateAppointment[0].slot_time[0]._id,
                        }
                    ]}
                });                  
                return updateUser; 
            } else {
                await Appointments.updateOne({   
                    "slot_date": day, 
                    "slot_time._id": updateAppointment[0].slot_time[0]._id
                }, { 
                    "$set": {
                        "slot_time.$.available": false,
                        "slot_time.$.phone": phone,
                        "slot_time.$.name": name,
                    } 
                });
            }
        } else {
            throw Error("Appointment are taken by someone else.");
        }   
    } catch (error) {
        throw error;
    }
};

// Cancel Appointment
const cancelAppointment = async (data) => {
    try {
        const { slot_date, slot_start } = data;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const day = new Date(slot_date).toLocaleDateString(undefined, options);
        const startTime = new moment(moment(slot_start, 'HH:mm')).format('HH:mm');
        const cancel = await Appointments.find({
            slot_date: day }, { 
            slot_time: { $elemMatch: { slot_start: startTime }}
        });
        console.log(cancel[0].slot_time.slot_start);
        console.log(cancel[0].slot_time[0].slot_start);
        console.log(cancel[0].slot_time[0].available);
        if (cancel.length > 0 ) { 
            if (!cancel[0].slot_time[0].available) {
                await User.updateOne({ 
                    "email" : cancel[0].slot_time[0].email }, {
                    "$pull": { "appointments": { "_id": cancel[0].slot_time[0]._id }}
                })
            }
            await Appointments.updateOne({    
                "slot_date": day}, 
                {"$pull" : {"slot_time" : {"slot_start": startTime}}
            });
        }
    } catch (error) {
        throw error;
    }
};

// Get Available Days
const getAvailableDays = async (data) => {
    try {
        const { slot_month } = data;
        // Check which days are existing
        const existingDay = await Appointments.find({ $text: { $search: slot_month }});
        let arr = [];
        for (let index = 0; index < existingDay.length; index++) {
            console.log(existingDay[index].slot_date);
            arr.push(existingDay[index].slot_date);
        }
        return arr;
    } catch (error) {
        throw error;
    }
};

// Get Appointments
const getAppointments = async (data) => {
    try {
        const { slot_date } = data;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const day = new Date(slot_date).toLocaleDateString(undefined, options);
        const existingDay = await Appointments.find({ slot_date: day });
        // Check if specific day is exists
        if (existingDay.length > 0) { 
            const array = existingDay[0].slot_time; 
            let arr = [];
            // Check if appointment time is available
            for (let index = 0; index < array.length; index++) {
                if (array[index].available) 
                    arr.push(array[index].slot_start);               
            }
            return arr;
        }
    } catch (error) {
        throw error;
    }
};

// Get My Appointments
const getMyAppointments = async (data) => {
    try {
        const { email } = data;
        // Check which days are existing
        const userDetails = await User.find({ email: email });
        console.log(userDetails[0].appointments); 
        const array = userDetails[0].appointments;           
        let arr = [];
        // console.log(existingDay[0]);
        for (let index = 0; index < array.length; index++) {
            arr.push(array[index]);
        }
        return arr;
    } catch (error) {
        throw error;
    }
};

// Get Calendar
const getCalendar = async (data) => {
    try {
        const { slot_time } = data;
        // Check which days are existing
        const existingDays = await Appointments.find({ $text: { $search: slot_time }});
        let arr = [];
        for (let index = 0; index < existingDays.length; index++) {
            arr.push({
                slot_date: existingDays[index].slot_date,
                slot_time: existingDays[index].slot_time
            });
        }
        return arr;
    } catch (error) {
        throw error;
    }
};

// const makeService = async (data) => {};
// const getServices = async (data) => {};
// const getImages = async (data) => {};


module.exports = { createNewWorkDay, makeAnAppointment, cancelAppointment, 
    getAvailableDays, getAppointments, getMyAppointments, getCalendar};

