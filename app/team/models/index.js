let mongoose = require('mongoose');

let TaskSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }],
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    time_created: {
        type: Date,
        default: new Date()
    },
    status: {
        type: Boolean,
        default: true
    },
    level: {
        type: Number,
        default: 4
    },
    availability: {
        type: String,
        default: 'go'
    }
});

let TaskModel = mongoose.model('teams', TaskSchema);
module.exports  = TaskModel;
