const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean
    },
    appointments: [{
        slot_date: {
            type: String,
            required: true,
        },
        slot_start: {
            type: String,
            required: true,
        },
        required: false,
    }]
});

UserSchema.index({email: 'text'});
const User = mongoose.model('User', UserSchema);

module.exports = User;