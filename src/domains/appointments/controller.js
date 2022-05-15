// const { workDay } = require("../../util/workDay");
// const Appointments = require("./model");
const Appointments = require("./model");
const moment = require("moment");
const User = require("../user/model");

// Create Work Day and availability
const createNewWorkDay = async (data) => {
    try {
        const { slot_date, slot_start, slot_end, spacious } = data;
        let dayTime = new moment(moment(slot_date, "MMM Do YY")).format("MMM Do YY");
        let startTime = moment(slot_start, 'HH:mm');
        let endTime = moment(slot_end, 'HH:mm');
        
        while (startTime < endTime) {
            const newAppointments = new Appointments({
                slot_date: dayTime,
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
        const dayTime = new moment(moment(slot_date, "MMM Do YY")).format("MMM Do YY");
        const startTime = new moment(moment(slot_start, 'HH:mm')).format('HH:mm');
        
        const userDetails = await User.find({ email });
        const updateAppointment = await Appointments.find({ 
            slot_date: dayTime}, 
            {slot_time: {$elemMatch: {slot_start: startTime}}
        });
        // console.log(updateAppointment[0].slot_time);
        // console.log(updateAppointment[0]._id);
        // console.log(updateAppointment[0].slot_time[0].slot_start);
        // console.log(updateAppointment[0].slot_time[0]._id);
        // console.log(userDetails[0]._id, userDetails[0].name);
        if (updateAppointment.length > 0 && updateAppointment[0].slot_time[0].available) { 
            await Appointments.updateOne(
            {   
                "slot_date": dayTime, 
                "slot_time._id": updateAppointment[0].slot_time[0]._id
            }, { 
                "$set": {
                    "slot_time.$.available": false,
                    "slot_time.$.email": email,
                    "slot_time.$.userId": userDetails[0]._id,
                    "slot_time.$.name": userDetails[0].name,
                } 
            });
        }    
    } catch (error) {
        throw error;
    }
};

// Cancel Appointment
const cancelAppointment = async (data) => {
    try {
        const { slot_date, slot_start } = data;
        const dayTime = new moment(moment(slot_date, "MMM Do YY")).format("MMM Do YY");
        const startTime = new moment(moment(slot_start, 'HH:mm')).format('HH:mm');
        const cancel = await Appointments.find({ 
            slot_date: dayTime}, 
            {slot_time: {$elemMatch: {slot_start: startTime}}
        });

        if (cancel.length > 0 ) { 
            await Appointments.updateOne({    
                "slot_date": dayTime}, 
                {"$pull" : {"slot_time" : {"_id": cancel[0].slot_time[0]._id}}
            });
        }
    } catch (error) {
        throw error;
    }
};

// Get Appointments
const getAppointments = async (data) => {
    try {
        const { slot_date } = data;
        const dayTime = new moment(moment(slot_date, "MMM Do YY")).format("MMM Do YY");
        const existingDay = await Appointments.find({ slot_date: dayTime });
        // Check if appointmet day is already exists
        if (existingDay.length > 0) { 
            let exists = false;
            const array = existingDay[0].slot_time; 
            let arr = [];
            // console.log(array);

            // Check if appointmet time is already exists
            for (let index = 0; index < array.length; index++) {
                if (array[index].available) {
                    // console.log(array[index], ' available');
                    arr.push(array[index].slot_start);

                    // exists = true;
                }
            }
            return arr;
        }
    } catch (error) {
        throw error;
    }
};


module.exports = { createNewWorkDay, makeAnAppointment, cancelAppointment, getAppointments};

