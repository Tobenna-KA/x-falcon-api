let config = require('../../../config')
let task_mail = require('./tasks_mail').mail
let domain = config.DOMAIN;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SG_API_KEY);

module.exports.mail = {
    ...task_mail,
    newUserMail: (data, callback) => {
        if(data.email && data.token) {
            let to = data.email;
            let from = config.ADMIN_MAIL;
            let subject = "Complete Account";

            let link = domain + '/complete-registration' + '/' + to + '/' + data.token;
            // console.log(link , 'link')
            const msg = {
                to: to,
                from: from,
                subject: subject,
                text: 'Set new account password',
                html: '<p>Hello, we have created an account for you, please use this link to create a password</p>' +
                    '<p><a href="'+ link +'">'+ link +'</a></p>',
            };
            sgMail.send(msg).then((err, data) => {
                if (err){
                    callback(false)
                } else {
                    callback(true)
                }
            })
        } else callback(false)
    },
    sendOTP: async (voter, callback) => {
        if(voter.email && voter.resetPasswordToken) {
            let to = voter.email;
            let from = 'elections@daystar.ac.ke';
            let subject = "Complete Account";
            let link = domain + "/voter/new-password/" + voter.email + "/" + voter.resetPasswordToken

            const msg = {
                to: to,
                from: from,
                subject: subject,
                text: 'Set new account password',
                html: '<p>Hello, <br> we have created an account for you to use in the upcoming elections, please use this link to create a password</p>' +
                    '<p>' +
                    '<a href="'+ link +'">'+ link +'</a>' +
                    '</p>',
            };
            let  result = await sgMail.send(msg)/*.then((err, data) => {*/
            // console.log(result)
            if(result) {
                callback(false)
            } else {
                callback(true)
            }
        } else
            callback(false)
    },
    sendResetOTP: async (user, callback) => {
        console.log(user)
        if(user.email && user.resetPasswordToken) {
            let to = user.email;
            let from = 'elections@daystar.ac.ke';
            let subject = "Reset Password";
            let link = domain + "/change/password/" + user.email + "/" + user.resetPasswordToken + "/" + user.user_type

            const msg = {
                to: to,
                from: from,
                subject: subject,
                text: 'Set new account password',
                html: '<p>Hello, <br> we received a request to change your password, if you didn\'t initiate this request please ignore this message, but hopefully ' +
                    'the request was from you, so here is a link to change your password </p>' +
                    '<p>' +
                    '<a href="'+ link +'">'+ link +'</a>' +
                    '</p>',
            };
            let  result = await sgMail.send(msg)/*.then((err, data) => {*/
            // console.log(result)
            if(result) {
                callback(false)
            } else {
                callback(true)
            }
        } else
            callback(false)
    },
    newCollegeMemberMail: (data, callback) => {
        if(data.email && data.identification && data.token) {
            let to = data.email;
            let from = 'admin@daystar.ac.ke';
            let subject = "Complete Electoral College Account";
            let link = domain + '/college-member' + '/' + to + '/' + data.identification + '/' + data.token;

            const msg = {
                to: to,
                from: from,
                subject: subject,
                text: 'Create account',
                html: '<p>Hello, we have created an account for you, please use this link to add a password</p>' +
                    '<p><a href="'+ link +'">'+ link +'</a></p>',
            };

            sgMail.send(msg).then((err, data) => {
                if (err){
                    callback(false)
                } else {
                    callback(true)
                }
            })
        } else callback(false)
    },
    changePasswordSuccessMessage: async (user, callback) => {
        if(user.email) {
            let to = user.email;
            let from = 'elections@daystar.ac.ke';
            let subject = "Password Change Success";

            const msg = {
                to: to,
                from: from,
                subject: subject,
                text: 'Password changed',
                html: '<p>Hello, <br> we have successfully changed your password </p>'
            };
            let  result = await sgMail.send(msg)/*.then((err, data) => {*/
            // console.log(result)
            if(result) {
                callback(false)
            } else {
                callback(true)
            }
        } else
            callback(false)
    }
};

