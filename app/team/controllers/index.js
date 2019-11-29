let teams = require('../models')
let helper = require('../../../helpers/general').helpers;

module.exports.team = {
    NEW_TEAM: (req, res) => {
        // console.log(req['authorization'])
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body.name && req.body.description && req.body.members && req.body.level && req.body.lead) {
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
                teams.find({_id: req.body._id}, (err, team) => {
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
                teams.findByIdAndUpdate({_id: req.body._id}, {
                    $push: {members: req.body.members}
                }, {new: true}, (err, team) => {
                    if (err) return res.status(200).send({
                        auth: true,
                        error: {message: 'something went wrong while adding teammate'}
                    })
                    return res.status(200).send({auth: true, error: false, team, message: 'Success'})
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
                    return res.status(200).send({auth: true, error: false, team, message: 'Success'})
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

    }
};
