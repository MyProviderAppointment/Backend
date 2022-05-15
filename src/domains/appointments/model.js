const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentsSchema = new Schema({
    slot_date: String,
    slot_time: [{
        slot_start: String,
        available: Boolean,
        email: String,
        userId: String,
        name: String,
        phone: Number,
    }],
   
});

// const Appointment = mongoose.model('Appointment', AppointmentSchema);
const Appointments = mongoose.model('Appointments', AppointmentsSchema);

module.exports = Appointments;