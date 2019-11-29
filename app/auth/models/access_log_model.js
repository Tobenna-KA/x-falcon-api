let mongoose = require('mongoose');

let AccessLogSchema = mongoose.Schema({
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
})

let AccessLogModel = mongoose.model('access_logs', AccessLogSchema);
module.exports = AccessLogModel;
