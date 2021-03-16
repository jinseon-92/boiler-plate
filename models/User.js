const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,           //string에서 빈칸을 붙여주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {         // token 사용 기간
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }