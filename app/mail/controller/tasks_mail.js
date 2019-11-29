let config = require('../../../config')
let domain = config.DOMAIN;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SG_API_KEY);

module.exports.mail = {
    NEW_TASK_MAIL: (data, callback) => {
        if(data.email) {
            let to = data.email;
            let from = config.ADMIN_MAIL;
            let subject = "New Task Alert!!!";

            let link = domain + '/get/task' + '/' + data._id;
            // console.log(link , 'link')
            const msg = {
                to: to,
                from: from,
                subject: subject,
                text: 'You have a new task',
                html: '<p>You have a new task</p>' +
                    '<p><a href="'+ link +'">'+ link +'</a></p>',
            };
            sgMail.send(msg).then((err, data) => {
                console.log(data)
                if (err){
                    callback(false)
                } else {
                    callback(true)
                }
            })
        } else callback(false)
    }
};

