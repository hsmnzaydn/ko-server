const installedApplicationSchema = require('../components/user/model/installed_application_model')
userSchema = require('../components/user/model/user_model')
userEnums = require('../components/user/enums')
coinSchema = require('../components/coin/model/coin-model')
Utility=require('../Utils/Utility')
Constant=require('../Utils/Constants')
settingSchema=require('../components/setting/model/setting-model');
module.exports = {
    register,
    verificationUser
}


async function register(req, res, next) {
    var installedApplication = new installedApplicationSchema({
        udid: req.headers['udid'],
        pnsToken: req.body.pnsToken
    })
    var phoneNumber = req.body.phoneNumber
    var nickname=req.body.nickname

    userSchema.findOne({
        $or: [
            {phoneNumber: phoneNumber},
            {nickname: nickname}
        ]
    }).then(function (user) {
        if (user == null) {
            return false
        } else {
            return true
        }

    }).then(function (isExist) {
        if (!isExist) {
            var name = req.body.name;
            var nickname = req.body.nickname;
            var password = req.body.password
            var phoneNumber = req.body.phoneNumber
            var serverId=req.body.serverId
            var surname=req.body.surname
            var isShowPhoneNumber=req.body.isShowPhoneNumber
            var coin = new coinSchema({

            })
            var setting=new settingSchema({

            })

            setting.servers.push(serverId);
            setting.save();
            var user = new userSchema({
                installedApplication: installedApplication._id,
                name: name,
                nickname: nickname,
                password: password,
                phoneNumber: phoneNumber,
                registerStatus: userEnums.userStatusEnum.UNCONFIRMED,
                registerServer:serverId,
                surname:surname,
                coin: coin,
                settings:setting,
                isShowPhoneNumber:isShowPhoneNumber,
                smsCode: global.sendSMSFromCheckMobiToUser(phoneNumber)
            })

            console.log("SMS code:", user.smsCode)

            coin.save()
            installedApplication.user = user._id
            installedApplication.save()
            return user;
        } else {
            res.status(global.EXIST_USER_CODE).send({
                code: global.EXIST_USER_CODE,
                message: global.EXIST_USER_MESSAGE
            })
            return Promise.reject(global.EXIST_USER_MESSAGE)
        }
    }).then(function (user) {

        user.save()
    }).then(function () {
        res.status(200).send({
            code: 200,
            message: 'OK',
            authorizationKey:installedApplication._id
        })
    }).catch(function (err) {
        console.log(err)
    })

}

async function verificationUser(req, res, next) {
    var smsCode = req.query.smsCode

    installedApplicationSchema.findOne({
        udid: req.headers['udid'],
        _id:req.headers['authorizationkey']
    }).
    populate({
            path: 'user'
        })
        .then(installedApplication => {

            //Sms servisi gelince entegre edilecek
            if (smsCode == installedApplication.user.smsCode) {
                return installedApplication
            }

            else {
                res.status(global.ERROR_SMS_CODE).send({
                    code: global.ERROR_SMS_CODE,
                    message: global.ERROR_SMS_MESSAGE
                })
            }
        }).then(installedApplication => {
            userSchema.findOne({
                installedApplication: installedApplication._id
            }).then(user => {

                user.registerStatus = userEnums.userStatusEnum.CONFIRMED

                user.save()
                res.status(200).send({
                    code: 200,
                    message: 'OK'
                })
            })
        }).catch(next)
}