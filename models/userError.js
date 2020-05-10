const mongoose = require('mongoose');

const userErrorSchema = new mongoose.Schema({
    errorMessage: {
        type: String
    },
    errorName: {
        type: String
    },
    errorEmail: {
        type: String
    },
    errorPassword: {
        type: String
    },
    errorRepeatPassword: {
        type: String
    }
})

module.exports = mongoose.model('UserError', userErrorSchema);