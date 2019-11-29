let reports = require('../models');
let helper = require('../../../helpers/general').helpers

module.exports.report = {
    NEW_REPORT: (req, res) => {
        if(helper.ensureNotAboveUserLevel(req['authorization'], 5, res)) {
            if(req.body.task && req.body.description && req.body.reporting_officer) {
                //create team
                reports.create({
                    description: req.body.description,
                    task: req.body.task,
                    reporting_officer: req.body.reporting_officer,
                    is_draft: false
                }, (err, report) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating report'}})
                    return res.status(200).send({auth: true, error: false, report, message: 'Success'})
                })
            }
        }
    },
    GET_REPORT: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            if(req.body._id) {
                //get report
                reports.find({_id: req.body._id}, (err, report) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while getting report'}})
                    return res.status(200).send({auth: true, error: false, report})
                })
            }
        }
    },
    GET_REPORTS: (req, res) => {
        if(helper.ensureUserLevelNoRes(req['authorization'], 7, res)) {
            //get reports
            reports.find({}, (err, reports) => {
                if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while getting reports'}})
                return res.status(200).send({auth: true, error: false, reports})
            })
        }
    },
    DRAFT_REPORT: (req, res) => {
        if(helper.ensureNotAboveUserLevel(req['authorization'], 5, res)) {
            if(req.body.task && req.body.description && req.body.reporting_officer) {
                //create team
                reports.create({
                    description: req.body.description,
                    task: req.body.task,
                    reporting_officer: req.body.reporting_officer
                }, (err, report) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'something went wrong while creating report'}})
                    return res.status(200).send({auth: true, error: false, report, message: 'Success'})
                })
            }
        }
    },
    ALTER_REPORT: (req, res) => {

    }
};
