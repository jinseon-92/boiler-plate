const express = require('express')
const app = express()
const port = 5000

const { User } = require("./models/User");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config/key');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World! 감사합니다~'))

app.post('/register', (req, res) => {
    console.log(req.body);
    // 회원가입에 필요한 정보를 client에서 가져오면 데이터베이스에 넣어줌
    const user = new User(req.body)
    console.log(user);

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
            
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))