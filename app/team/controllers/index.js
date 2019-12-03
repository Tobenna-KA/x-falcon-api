let teams = require('../models')
let helper = require('../../../helpers/general').helpers;
let user = require('../../user/models')

module.exports.team = {
    NEW_TEAM: (req, res) => {
        // console.log(req['authorization'])
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body.name && req.body.description
                && req.body.members && req.body.level && req.body.lead) {
                //create team
                teams.create({
                    name: req.body.name,
                    description: req.body.description,
                    members: req.body.members,
                    lead: req.body.lead,
                    level: req.body.level
                }, (err, team) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating team'}})
                    return res.status(200).send({auth: true, error: false, team, message: 'Success'})
                })
            }
        }
    },
    GET_TEAM: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id) {
                //get team
                teams.findById(req.body._id)
                    .populate('members', ['first_name', 'last_name', 'email', 'status', 'level'])
                    .exec( (err, team) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while getting team'}})
                    return res.status(200).send({auth: true, error: false, team})
                })
            }
        }
    },
    GET_TEAMS: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            //get teams
            teams.find({}, (err, teams) => {
                if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while getting teams'}})
                return res.status(200).send({auth: true, error: false, teams})
            })
        }
    },
    EDIT_TEAM: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body.name && req.body.description && req.body.members && req.body.level) {
                //create team
                teams.findByIdAndUpdate({_id: req.body._id}, {
                    name: req.body.name,
                    description: req.body.description,
                    members: req.body.members,
                    lead: req.body.lead,
                    level: req.body.level
                }, {new: true}, (err, teams) => {
                    if (err) return res.status(200).send({
                        auth: true,
                        error: {message: 'something went wrong while getting teams'}
                    })
                    return res.status(200).send({auth: true, error: false, teams, message: 'Success'})
                })
            }
        }
    },
    NEW_TEAMMATE: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id && req.body.members) {
                //create team
                teams.findByIdAndUpdate(req.body._id, {
                    $push: {members: req.body.members}
                }, {new: true}, (err, team) => {
                    if (err) return res.status(200).send({
                        auth: true,
                        error: {message: 'something went wrong while adding teammate'}
                    })
                    user.update({_id: {$in: req.body.members}}, {$set: {has_team: true}}, {multi: true}, (err, users) => {
                        if (err) return res.status(200).send({
                            auth: true,
                            error: {message: 'something went wrong while updating teammate details'}
                        })
                        return res.status(200).send({auth: true, error: false, team, message: 'Success'})
                    })
                })
            }
        }
    },
    REMOVE_TEAMMATE: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id && req.body.members) {
                //create team
                teams.findByIdAndUpdate({_id: req.body._id}, {
                    $pull: {
                        members: {
                            $in: req.body.members
                        }
                    }
                }, {new: true}, (err, team) => {
                    if (err) return res.status(200).send({
                        auth: true,
                        error: {message: 'something went wrong while adding teammate'}
                    })
                    user.update({_id: {$in: req.body.members}}, {$set: {has_team: false}}, {multi: true}, (err, users) => {
                        if (err) return res.status(200).send({
                            auth: true,
                            error: {message: 'something went wrong while updating teammate details'}
                        })
                        return res.status(200).send({auth: true, error: false, team, message: 'Success'})
                    })
                })
            }
        }
    },
    ACTIVATE_TEAM: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id && req.body.action) {
                //create team
                teams.findByIdAndUpdate({_id: req.body._id}, {
                    status: (req.body.action === 'Activate')
                }, {new: true}, (err, teams) => {
                    if (err) return res.status(200).send({
                        auth: true,
                        error: {message: 'something went wrong while getting teams'}
                    })
                    return res.status(200).send({auth: true, error: false, teams, message: 'Success'})
                })
            }
        }
    },
    MERGE_TEAMS: (req, res) => {

    },
    SUGGEST_TEAMS: (req, res) => {
        let param = req.body.param
        param = new RegExp('^' + param + '.*')
        teams.find({
            name: {
                '$regex': param,
                '$options': 'i'
            },
            availability: 'go'
        })
        .select('name availability status task_level')
        .populate('company_id', ['company_name'])
        .limit(20).exec((err, suggestions) => {
            console.log(suggestions)
            res.status(200).send({auth: true, error: false, suggestions})
        });
    }
};
