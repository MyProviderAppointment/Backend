const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentsSchema = new Schema({
    slot_date: {
        type: String,
        required: true,
    },
    slot_time: [{
        slot_start: {type: String,
            required: true,
        },
        slot_end: {type: String,
            required: true,
        },
        available: Boolean,
        email: String,
        userId: String,
        name: String,
        phone: Number,
    }],  
});

AppointmentsSchema.index({slot_date: 'text', 'slot_time.slot_start': 'text'});
const Appointments = mongoose.model('Appointments', AppointmentsSchema);

module.exports = Appointments;