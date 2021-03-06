const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

//비밀번호 맞는지 체크하는 메서드
userSchema.methods.comparePassword = function(plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function(err,isMatch) {
        if(err) return cb(err);
        cb(null,isMatch);
    })
}

//비밀번호가 맞다면 토큰 생성하는 메서드
userSchema.methods.generateToken = function(cb) {
    
    var user = this;
    //jsonwebtoken을 이용하여 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })   
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 ID를 이용하여 유저를 찾은 다음 클라이언트에서 가져온 TOKEN과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }