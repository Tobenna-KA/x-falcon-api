let User = require('../models')
let jwt = require('../../../helpers/general/jwt')
let helper = require('../../../helpers/general').helpers
let Mail = require('../../mail/controller').mail
const TokenGenerator = require('uuid-token-generator');

module.exports.user = {
    NEW_USER: async (req, res) => {
        if (req.body.email && req.body.first_name && req.body.last_name && req.body.identification) {
            let password = (req.body.password)? req.body.password : await new TokenGenerator().generate(); // Default is a 128-bit token encoded in base58
            let reset_token = await new TokenGenerator().generate();
            let userData = {
                email: req.body.email,
                password: password,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                restPasswordToken: reset_token,
                identification: req.body.identification,
                status: (req.body.status === true)
            }

            User.create(userData, async (err, user) => {
                console.log(err, userData)
                if (err) {
                    let err_msg = (err.code === 11000) ? 'User with the same Email already exists' : 'Ooops something went wrong'
                    res.status(200).send({ok: false, error: {message: err_msg}, auth: true})
                } else {

                    let token = null
                    await jwt.signToken({ id: user._id, level: user.level }, (result) => {
                        token = result;
                    });
                    user.password = null
                    Mail.newUserMail({email: req.body.email, token: reset_token}, (sent) => {
                        res.status(200).send({ auth: true, token, user, message: 'Success', ok: true});
                    })
                }
            });

        }else {
            res.status(200).send({auth: true, token: null, error: {message: 'All required fields not filled!'}, ok: false});;
        }
    },
    GET_USER: async (req, res) => {
        if(await helper.isAdmin(req.headers['authorization'], true))
            if(req.body._id) {
                let user = await User.findOne({_id: req.body._id}).select('-password')
                // console.log(user)
                res.status(200).send({auth: true, user})
            } else {
                res.status(200).send({auth: true, token: null, error: {message: 'All required fields not filled!'}});
            }
        else res.send({auth: true, error: {message: "You do not have permission to make this change. This issue has been reported"}})
    },
    GET_USERS: async (req, res) => {
        let users = await User.find({}).select('-password')
        res.status(200).send({auth: true, users})
    },
    EDIT_USER: async (req, res) => {
        if (await helper.ensureUserLevelNoRes(req.headers["authorization"], 7, res) ||
            await helper._ensureIsThisUser(req.headers['authorization'], req.body._id))
            if (req.body.first_name && req.body.last_name && req.body.level && req.body.identification) {
                User.findOneAndUpdate({_id: req.body._id}, {
                    _id: req.body._id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    identification: req.body.identification,
                    level: req.body.level
                }, {new: true}, (err, user) => {
                    if (err) return res.status(200).send({auth: true, error: {message: 'Ooops something went wrong'}, err})
                    if(!user){
                        return res.status(200).send({auth: true, error: {message: 'User does not exist'}, err})
                    }
                    user.password = null
                    return res.status(200).send({auth: true, error: false, user, message: 'Success'})
                })
            } else res.status(200).send({auth: true, error: {'message': 'All required fields must be filled'}})
        else res.status(200).send({auth: true, error: {'message': 'You can not access this action'}})
    },
    ACTIVATE_USER: async (req, res) => {
        if (await helper.ensureUserLevelNoRes(req.headers["authorization"], 7, res)) {
            if(req.body._id && req.body.action) {
                let status = (req.body.action === 'Activate')
                // update det
                User.findOneAndUpdate({_id: req.body._id}, {$set: {status}}, {new: true}, (err, user) => {
                    if(err) return res.status(200).send({auth: true, error: {message: 'Update Failed'}});
                    user.password = null;
                    return res.status(200).send({auth: true, error: false, message: 'Success', user})
                })
            } else res.status(200).send({auth: true, token: null, error: {message: 'All required fields not filled!'}, ok: false});
        } else return res.status(200).send({auth: true, error: {'message': 'You can not access this action'}})
    },
    SUGGEST_TEAM_MEMBERS: async (req, res) => {
        User.find({
            $and: [
                {
                    has_team: false,
                    level: {$gte: req.body.param}
                }
            ]
        })
        .select('first_name last_name')
        .exec((err, users) => {
            console.log(err, users)
            res.status(200).send({auth: true, error: false, users})
        });
    }
};
