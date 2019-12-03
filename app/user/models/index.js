let mongoose = require('mongoose'),
    b_crypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: false
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    identification: {
        type: String,
        required: true,
        unique: true
    },
    level: {
        type: Number,
        default: 4,
    },
    status: {
        type: Boolean,
        default: false,
    },
    has_team: {
        type: Boolean,
        default: false,
    },
    profileImg: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: {
        type: String
    }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    UserModel.findOne({ email: email })
        .exec((err, user) => {
            if (err) {
                return callback(err)
            } else if (!user) {
                err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }

            b_crypt.compare(password, user.password, function(err, result) {
                if (result === true) {
                    user.password = null
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
};

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    let admin = this;
    b_crypt.hash(admin.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        admin.password = hash;
        next();
    })
});

let UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
