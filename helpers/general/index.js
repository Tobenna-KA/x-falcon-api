module.exports.helpers = {
    /**
     * Verifies that date is before another date with days interval
     * @param date_from
     * @param date_to
     * @param days
     * @returns {boolean} if date_from is less than date_to then date
     */
    dateIsBefore: (date_from, date_to, days = 1) => {
        let interval = 3600 * (24 * days) * 1000 //set interval
        //subtract interval from date_to
        date_from -= interval  // import dependencies
        return (date_from < date_to) //is date_from before or after date_to
    },
    dateIsAfter: (date_from, date_to) => {
        return (date_from <= date_to) //is date_from before or after date_to
    },
    isAdmin: async (id, token = false) => {
        if (token) {
            // import dependencies
            const jwt = require("./jwt");
            //decode token
            let auth = jwt.decode(id)
            id = auth.payload.user
        }

        let Admin = await require('../../app/user/models');
        return await Admin.findById(id, (err, admin) => {
            if(err) return null
            if(admin === null || admin.length === 0) return null
            return admin
        })
    },
    ensureUserLevel: async (token, req_level, res) => {
        // import dependencies
        const jwt = require("./jwt");
        let Schema = require('../../app/user/models');

        //decode token
        let auth = jwt.decode(token)
        // console.log(auth)
        let user = auth.payload.user
        let level
        //verify that level is set
        if(auth.payload.level) {
            level  = auth.payload.level
            let allow = false
            let userData = await Schema.findById(user, (err, userData) => { return userData})
            if(userData)
                if(userData.level) //check that user has level
                    if (userData.level === level) //verify that the level matches the one encoded in token
                        allow = (level === req_level) //verify that user can access function
            if (allow) {
                return allow
            } else {
                res.send({auth: true, error: {message: "You do not have permission to make this change. This issue has been reported"}})
            }
            return false
        }else return false
    },
    ensureUserLevelNoRes: async (token, req_level, res) => {
        // import dependencies
        const jwt = require("./jwt");
        let Schema = require('../../app/user/models');
        // console.log(token)
        //decode token
        let auth = await jwt.decode(token)
        if(!auth) return false
        let user = auth.payload.user
        let level

        //verify that level is set
        if(auth.payload.level) {
            level  = auth.payload.level
            let allow = false
            let userData = await Schema.findById(user, (err, userData) => { return userData})
            if(userData)
                if(userData.level) //check that user has level
                    if (userData.level === level) //verify that the level matches the one encoded in token
                        allow = (level === req_level) //verify that user can access function
            if (allow) {
                return allow
            } else {
                return false
            }
        }else return false
    },
    ensureNotAboveUserLevel: async (token, req_level, res) => {
        // import dependencies
        const jwt = require("./jwt");
        let Schema = require('../../app/user/models');
        // console.log(token)
        //decode token
        let auth = await jwt.decode(token)
        if(!auth) return false
        let user = auth.payload.user
        let level

        //verify that level is set
        if(auth.payload.level) {
            level  = auth.payload.level
            let allow = false
            let userData = await Schema.findById(user, (err, userData) => { return userData})
            if(userData)
                if(userData.level) //check that user has level
                    if (userData.level >= level) //verify that the level matches the one encoded in token
                        allow = (level >= req_level) //verify that user can access function
            if (allow) {
                return allow
            } else {
                return false
            }
        }else return false
    },
    /**
     * ensure that the user trying to edit account content is not editing
     * outside their account
     * and has the level requirements to do so
     * @param token
     * @param me
     * @param schema
     * @param res
     * @returns {Promise<boolean>}
     */
    ensureIsThisUser: async (token, me, schema, res) => {
        // import dependencies
        const jwt = require("./jwt");

        //decode token
        let auth = jwt.decode(token)
        /*console.log(auth)
        console.log(schema)*/
        let user = auth.payload.user
        let level
        if (user !== me){ //check that user is whom they say they are
            res.send({auth: true, error: {message: "You cannot make changes to someone else's account"}})
            return false
        } else {
            return true
        }
    },
    _ensureIsThisUser: async (token, me) => {

        const jwt = require("./jwt");

        //decode token
        let auth = await jwt.decode(token)
        // console.log('user', auth.payload.user, me)
        return (auth.payload.user === me)//check that user is whom they say they are
    },
    /**
     * Check that token is for chiefReturning Officer
     * @param token
     * @returns {*}
     */
    isChiefReturning: (token) => {
        // import dependencies
        const jwt = require("./jwt");
        //decode token
        let auth = jwt.decode(token)
        return auth.chiefReturning
    },
    checkDirectory: (directory, callback) =>
    {
        // console.log(directory, 'err')
        let fs  = require('fs')
        let fx = require('mkdir-recursive');
        fs.stat(directory, function(err, stats) {
            //Check if error defined and the error code is "not exists"
            // console.log(directory, 'err', err)
            if (err) {
                // console.log(directory, 'err')
                fx.mkdir(directory, callback);
            }
        });

    },
    /**
     * Check that file exists
     * @param new_path
     * @return {void | Query | * | never}
     */
    filExists: async (new_path) => {
        let fs  = require('fs')
        fs.exists(new_path, function(exist){
            return exist
        })
    }
};
