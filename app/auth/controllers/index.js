let User = require('../../user/models')
let jwt = require('../../../helpers/general/jwt')
let helper = require('../../../helpers/general').helpers
let Mail = require('../../mail/controller').mail
let b_crypt = require('bcryptjs');
const TokenGenerator = require('uuid-token-generator');

module.exports.security = {
    LOGIN: async (req, res) => {
        User.authenticate(req.body.email, req.body.password, async function (error, user) {
            if (error || !user) {
                let error = {message: 'Wrong email or password.'};
                res.status(200).send({ auth: false, token: null, error});
            } else {
                if(!user.status) {
                    let error = {message: 'Your account has been Suspended'};
                    return res.status(200).send({ auth: false, token: null, error});
                }
                let token = null
                await jwt.signToken({ id: user._id, level: user.level }, (result) => {
                    token = result;
                });
                res.status(200).send({ auth: true, token, user});
            }
        });
    },
    CHANGE_PASSWORD: (req, res) => {
        // verify required fields
        if (req.body.email && req.body._id && req.body.cur_password && req.body.new_password) {
            // test the user current details by doing a mock up login
            let Schema = User;

            let action = new Promise(async function (resolve, reject) {
                await Schema.authenticate(req.body.email, req.body.cur_password, (err, user) => {
                    if (user) resolve();
                    if (!user) reject();
                })
            })

            action.then(async () => {
                await b_crypt.hash(req.body.new_password, 10, (err, hash) => {
                    if (err) throw false
                    Schema.findOneAndUpdate({
                            _id: req.body._id,
                            email: req.body.email
                        },
                        {
                            password: hash
                        }, {new: true}, async (err, user) => {
                            if(err) return  await res.status(200).send({auth: true, error: {message: 'problems changing user password'}})
                            await res.status(200).send({auth: true, error: false, message: 'Success!!'})
                        })
                })
            }).catch((err)=> {
                res.status(200).send({auth: true, error: {message: 'Wrong old password'}})
            })
        } else {
            res.status(200).send({auth: true, error: {message: 'Error changing password'}})
        }
    },
    REQUEST_PASSWORD_RECOVERY: async (req, res) => {
        if (req.body.email) {
            // test the user current details by doing a mock up login
            let Schema = User
            //generate new password reset token
            let temp_password = new TokenGenerator().generate(); // Default is a 128-bit token encoded in base58
            let user = await Schema.findOne({ email: req.body.email });

            if(user) {
                //make changes to db
                Schema.findOneAndUpdate({email: req.body.email}, {$set: {resetPasswordToken: temp_password}}, (err, user) => {
                    if(err) return res.status(200).send({auth: true, error: false, message: 'Request made successfully. Please check your email for the reset link. If you provided the ' +
                            'right details, you should find a link to reset your account.'})

                    // send password reset mail
                    Mail.sendResetOTP({
                        email: req.body.email,
                        resetPasswordToken: temp_password,
                        user_type: req.body.user_type
                    }, (user) => {
                        return res.status(200).send({auth: true, error: false, message: 'Request made successfully. Please check your email for the reset link. If you provided the ' +
                                'right details, you should find a link to reset your account.'})
                    })

                })
            } else res.status(200).send({auth: true, error: false, message: 'Request made successfully. Please check your email for the reset link. If you provided the ' +
                    'right details, you should find a link to reset your account.'})

        } else {
            res.status(200).send({auth: true, error: {message: 'Error changing password'}})
        }
    },
    COMPLETE_PASSWORD_RECOVERY: async (req, res) => {
        // verify required fields
        if (req.body.email && req.body.password && req.body.token) {
            // test the user current details by doing a mock up login
            let Schema = User
            let temp_password = new TokenGenerator().generate(); // Default is a 128-bit token encoded in base58
            let user_searched = await Schema.findOne({email: req.body.email, resetPasswordToken: req.body.token })
            if (user_searched)
                await b_crypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) throw false
                    Schema.findOneAndUpdate({
                            email: req.body.email
                        },
                        {
                            password: hash,
                            resetPasswordToken: temp_password
                        }, {new: true}, async (err, user) => {
                            if(err) return  await res.status(200).send({auth: true, error: {message: 'problems changing user password'}})
                            Mail.changePasswordSuccessMessage({email: req.body.email }, () => {
                                return res.status(200).send({auth: true, error: false, message: 'Success!!'})
                            })
                        })
                })
            else {
                Schema.findOneAndUpdate({
                        email: req.body.email
                    },
                    {
                        resetPasswordToken: temp_password
                    }, {new: true}, async (err, user) => {
                        return await res.status(200).send({auth: true, error: {message: 'problems changing user password, link might be expired'}})
                    })
            }

        } else {
            res.status(200).send({auth: true, error: {message: 'Error changing password'}})
        }
    }
};
