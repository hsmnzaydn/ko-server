const userSchema = require('./model/user_model')
installedApplicationSchema = require('./model/installed_application_model')
constant = require('../../Utils/Constants')
utility = require('../../Utils/Utility')
uuid = require('uuid/v1');
userEnums = require('./enums')
mailUtility = require('../../Utils/mail_utility')
coinSchema = require('../coin/model/coin-model');
firebase = require('../../Utils/firebase')
entryEnums = require('../../components/entry/enums')
module.exports = {
    registerUser,
    logout,
    getNotifications,
    getCoins,
    getUser,
    userUpdate,
    getUserSettings,
    updateSettings,
    getUsers,
    sendNotification,
    getMe
}

async function registerUser(req, res, next) {
    var udid = req.headers.udid;

    var installedApplicationObject = new installedApplicationSchema({
        udid: udid
    });

    var userObject = new userSchema({
        installedApplication: installedApplicationObject._id,
        name: req.body.name,
        surname: req.body.surname,
        registerStatus: userEnums.userStatusEnum.UNCONFIRMED,
        registerServer: req.body.serverId,
        password: req.body.password
    });

    installedApplicationObject.user = userObject._id;
    userObject.installedApplication = installedApplicationObject._id;


    userObject.save().then(function (user) {
        mailUtility.sendMail(userObject.emailAddress)
    }).then(function () {
        installedApplicationObject.save()
    }).then(function () {
        res.send({
            code: global.WAITING_VALIDATION_CODE,
            message: global.WAITING_VALIDATION_MESSAGE,
            secretKey: installedApplicationObject._id
        })
    }).catch(next)

}


async function logout(req, res, next) {
    userSchema.findOne({
        _id: req.params.userId
    }).populate({
        path: 'installedApplication'
    })
        .then(user => {
            installedApplicationSchema.findOne({
                _id: user.installedApplication._id
            }).then(installedApplication => {
                installedApplication.remove()
                user.installedApplication = null
                return user;
            })
        }).then(function (user) {
        console.log(user)

        user.save()
        res.status(200).send({
            code: 200,
            message: 'OK'
        })
    }).catch(next)
}


async function getNotifications(req, res, next) {
    userSchema.findOne({
        _id: req.params.userId
    }).populate({
        path: 'installedApplication'
    })
        .then(user => {
            installedApplicationSchema.findOne({
                _id: user.installedApplication._id
            }).then(installedApplication => {
                installedApplication.remove()
                user.installedApplication = null
                return user;
            })
        }).then(function (user) {

        user.save()
        res.status(200).send({
            code: 200,
            message: 'OK'
        })
    }).catch(next)
}


async function getCoins(req, res, next) {
    userSchema.findOne({
        _id: req.params.userId
    }).populate({
        path: 'coin'
    })
        .then(user => {
            res.status(200).send(user.coin)
        }).catch(next)
}


async function getUser(req, res, next) {
    userSchema.findOne({
        _id: req.params.userId},['nickname','phoneNumber','registerServer','isShowPhoneNumber']).populate([{
        path: 'entries',select:['createdDate','entryImageUrl','_id','header','message','price','status']
    }, {
        path: 'coin',select:['value']
    },{
        path: 'registerServer',select:['name']
    }])
        .then(user => {

            var entries = [];
            user.entries.map(entry => {
                if (entry.status == entryEnums.entryStatusEnum.CONFIRMED && !entry.isDisable) {
                    entry.entryImageUrl = process.env.BASE_URL + entry.entryImageUrl
                    entries.push(entry)
                }
            })
            user.entries = entries

            return user

        }).then(user => {
        res.status(200).send(user)

    }).catch(next)
}


async function getUsers(req, res, next) {
    userSchema.find().populate({path: 'registerServer'})
        .then(users => {
            res.render('users', {
                users: users
            })


        }).catch(next)
}

async function userUpdate(req, res, next) {
    var userId = req.params.userId;
    if (req.method == "GET") {
        userSchema.findOne({_id: userId}).populate({
            path: 'coin'
        }).then(user => {
            res.render('users-edit', {
                user: user
            })
        }).catch(next)

    } else if (req.method == "POST") {
        userSchema.findOne({_id: userId}).then(user => {
            var userName = req.body.userName;
            var surName = req.body.surname;
            var nickname = req.body.nickname;
            var phoneNumber = req.body.phoneNumber;
            var coin = new coinSchema({
                value: req.body.coin
            });

            user.coin = coin;
            user.name = userName;
            user.surname = surName;
            user.nickname = nickname;
            user.phoneNumber = phoneNumber;
            coin.save();
            return user;
        }).then(user => {
            user.save();
            res.redirect('/admin/users')

        }).catch(next)
    }
}


async function getUserSettings(req, res, next) {

}


async function updateSettings(req, res, next) {

}

async function sendNotification(req, res, next) {
    var userId = req.params.userId;

    if (req.method == "GET") {
        res.render('send-notification')

    } else if (req.method == "POST") {
        installedApplicationSchema.findOne({user: userId}).then(installedApplication => {

            firebase.sendNotificationToDevice(req.body.header, req.body.message, installedApplication.pnsToken)
            res.redirect('/admin/users')

        }).catch(next)
    }

}

async function getMe(req, res, next) {
    var userId = res.userId.toString()
    userSchema.findOne({_id: userId},['nickname','phoneNumber','registerServer','isShowPhoneNumber']).populate([{
        path: 'entries',select:['createdDate','entryImageUrl','_id','header','message','price','status']
    }, {
        path: 'coin',select:['value']
    },{
        path: 'registerServer',select:['name']
    }])
        .then(user => {
            var entries = [];
            user.entries.map(async entry => {
                if (entry.status == entryEnums.entryStatusEnum.CONFIRMED && !entry.isDisable) {
                    entry.entryImageUrl = process.env.BASE_URL + entry.entryImageUrl
                    entries.push(entry)
                }
            })
            user.entries = entries

            return user
        }).then(user => {

        res.status(200).send(user)
    }).catch(next)
}