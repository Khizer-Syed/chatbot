const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: 'Test123' },
    phone: { type: String, required: true, unique: true },
    address: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        province: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function(next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
