let mongoose = require('mongoose');

let ErrorLogSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    issue: {
        type: String
    },
    time_entered: {
        type: Date,
        required: true,
        default: new Date()
    },
    time_out: {
        type: Date
    }
});

let ErrorLogModel = mongoose.model('auth_error_logs', ErrorLogSchema);
module.exports = ErrorLogModel;
