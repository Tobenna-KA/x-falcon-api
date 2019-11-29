'use strict';
const fs   = require('fs');
const jwt   = require('jsonwebtoken');
let privateKEY  = fs.readFileSync('./private.key', 'utf8');
let publicKEY  = fs.readFileSync('./public.key', 'utf8');

let i = 'My Org'; //Issuer
let s = 'My Org'; //subject
let a = 'My Org'; // Audience

//Signing Options
let signOpt = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: "1hr",
    algorithm: "RS256"
}
let verifyOpt = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: "1hr",
    algorithm: ["RS256"]
}

module.exports = {
    ensureToken: (bearerHeader, callback) => {
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(" ");
            callback(bearer[1])
        }else {
            callback(false)
        }
    },
    signToken: (payload, callback) => {
        /*signOpt.issuer = payload.signOpt.i
        signOpt.subject = payload.signOpt.s
        signOpt.audience = payload.signOpt.a*/
        const token = jwt.sign({
            user: payload.id, level: payload.level
        }, privateKEY, /*payload.*/signOpt);
        // console.log(token , 'mytoken')
        callback(token)
    },
    verifyToken: (payload, callback) => {
        /*verifyOpt.issuer = payload.verifyOpt.i
        verifyOpt.subject = payload.verifyOpt.s
        verifyOpt.audience = payload.verifyOpt.a*/
        jwt.verify(payload.token, publicKEY, verifyOpt, (err, data) => {
            (err)? callback({error: true}): callback({error: false, data: data})
        })
    },
    decode: (token) => {
        if (token) {
            token = token.split(" ")
            token = token[1]
        } else token = ""
        // console.log(jwt.decode(token, {complete: true}))
        return jwt.decode(token, {complete: true});
    }
};
