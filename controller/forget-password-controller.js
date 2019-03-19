const userSchema = require('../components/user/model/user_model')
Constant = require('../Utils/Constants');
Utility = require('../Utils/Utility')

module.exports = {
    forgetPasswordStepOne,
    forgetPasswordStepTwo,
    forgetPasswordStepThree
}


async function forgetPasswordStepOne(req, res, next) {
    var phoneNumber = req.query.phoneNumber

    userSchema.findOne({phoneNumber: phoneNumber}).then(user => {
        user.smsCode = global.createRandomCode()
        user.save()
        return user
    }).then(user => {
        global.sendSMSFromCheckMobiToUser(user.phoneNumber)
        res.status(200).send({
            code: global.OK_CODE,
            message: global.OK_MESSAGE
        })
    })
        .catch(next)

}


async function forgetPasswordStepTwo(req, res, next) {
    var phoneNumber = req.query.phoneNumber;
    var smsCode = req.query.smsCode;

    userSchema.findOne({phoneNumber: phoneNumber}).then(user => {
        if (smsCode == user.smsCode) {
            return true
        } else {
            return false
        }
    }).then(status => {
        if (status) {
            res.status(global.OK_CODE).send({
                code: global.OK_CODE,
                message: global.OK_MESSAGE
            })
        } else {
            res.status(global.ERROR_SMS_CODE).send({
                code: global.ERROR_SMS_CODE,
                message: global.ERROR_SMS_MESSAGE
            })
        }

    })
        .catch(next)
}

async function forgetPasswordStepThree(req, res, next) {
    var phoneNumber = req.query.phoneNumber;
    var password = req.body.password;

    userSchema.findOne({phoneNumber: phoneNumber}).then(user => {
        user.password = password;
        user.save()
    }).then(status => {
        res.status(200).send({
            code: global.OK_CODE,
            message: global.OK_MESSAGE
        })


    })
        .catch(next)
}
