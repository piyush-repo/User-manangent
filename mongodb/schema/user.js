"use strict";

module.exports = function (mongoose) {
    let userSchema = new mongoose.Schema({
        emailId: {
            type: String,
            required: true
        },
        password: {
            type: String
        },
        createddate: {
            type: Date,
            default: Date.now
        },
        updateddate: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        }
    });

    return mongoose.model('users', userSchema);
};
