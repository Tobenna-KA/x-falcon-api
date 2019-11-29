let mongoose = require('mongoose');

let OperationalReportsSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks'
    },
    reporting_officer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    time_created: {
        type: Date,
        default: new Date()
    },
    is_draft: {
        type: Boolean,
        default: true
    }
});

let OperationalReportsModel = mongoose.model('operational_reports', OperationalReportsSchema)
module.exports = OperationalReportsModel;
