let mongoose = require('mongoose');

let TaskSchema  = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams',
        required: true
    },
    /*user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },*/
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports'
    },
    complete_by: {
        type: Date
    },
    priority: {
        type: String,
        default: true
    },
    level: {
        type: Number,
        required: true
    },
    time_created: {
        type: Date,
        default: new Date()
    },
    time_started: {
        type: Date
    },
    time_completed: {
        type: String
    },
    status: {
        type: String
    }
});

let TaskModel = mongoose.model('tasks', TaskSchema);
module.exports  = TaskModel;
