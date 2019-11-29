let task_model = require('../models/')
let team_model = require('../../team/models/')
let helper = require('../../../helpers/general').helpers
let Mail = require('../../mail/controller').mail


module.exports.task = {
    NEW_TASK: (req, res) =>  {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body.name && req.body.description
                && req.body.priority && req.body.complete_by && req.body.team) {
                //create team
                task_model.create({
                    name: req.body.name,
                    description: req.body.description,
                    priority: req.body.priority,
                    complete_by: req.body.complete_by,
                    team: req.body.team
                }, (err, task) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating team'}})
                    //get the task with populated member details
                    team_model.findById(req.body.team)
                        .populate('members', ['email', 'first_name', 'last_name'])
                        .exec((err, members) => {
                            // console.log(members, err)
                            if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating team'}})
                            let i = 0;
                            //iterate over members
                            members.members.forEach(async (member) => {
                                // send alert email to each member
                                await Mail.NEW_TASK_MAIL({_id: member._id, email: member.email}, () => {})
                                if(i === members.members.length - 1) {
                                    return res.status(200).send({auth: true, error: false, task, message: 'Success'})
                                }
                                i++;
                            })
                        })
                })
            }
        }
    },
    GET_TASK: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id) {
                //get task
                task_model.find({_id: req.body._id}, (err, task) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while getting team'}})
                    return res.status(200).send({auth: true, error: false, task})
                })
            }
        }
    },
    GET_TASKS: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            //get tasks
            task_model.find({}, (err, tasks) => {
                if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while getting team'}})
                return res.status(200).send({auth: true, error: false, tasks})
            })
        }
    },
    EDIT_TASK: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body.name && req.body.description && req.body.members
                && req.body.priority && req.body.complete_by && req.body.team) {
                //create team
                task_model.findById(req.body._id, {
                    name: req.body.name,
                    description: req.body.description,
                    members: req.body.members,
                    priority: req.body.priority,
                    complete_by: req.body.complete_by,
                    team: req.body.team
                }, {new: true}, (err, task) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating team'}})
                    return res.status(200).send({auth: true, error: false, task, message: 'Success'})
                })
            }
        }
    },
    UPDATE_TASK: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id && req.body.name && req.body.description && req.body.members
                && req.body.priority && req.body.complete_by && req.body.team) {
                //create team
                task_model.findByIdAndUpdate(req.body._id, {
                    name: req.body.name,
                    description: req.body.description,
                    members: req.body.members,
                    priority: req.body.priority,
                    complete_by: req.body.complete_by,
                    team: req.body.team
                }, {new: true}, (err, task) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating team'}})
                    return res.status(200).send({auth: true, error: false, task, message: 'Success'})
                })
            }
        }
    },
    COMPLETE_TASK: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id && req.body.status) {
                //create team
                task_model.findByIdAndUpdate(req.body._id, {
                    time_completed: new Date(),
                    status: req.body.status
                }, {new: true}, (err, task) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating team'}});
                    return res.status(200).send({auth: true, error: false, task, message: 'Success'})
                })
            }
        }
    },
    DELETE_TASK: (req, res) => {

    }
};
