const notificationSchema = require('./model/notification-model');
firebase = require('../../Utils/firebase');
Constant = require('../../Utils/Constants');
userSchema = require('../user/model/user_model');
userStatusEnums=require('../user/enums')

module.exports = {
    getNotificationsAdmin,
    createNotifications,
    getNotifications
}

async function getNotificationsAdmin(req, res, next) {
    notificationSchema.find().then(notifications => {
        res.render('bildirimler', {
            notifications: notifications
        })
    })
}

async function getNotifications(req, res, next) {
    var userId = res.userId;


    userSchema.findOne({_id: userId}, ['notifications']).populate({
        path: 'notifications', select: ['title', 'message']
    }).then(user => {
        model = {isSuccess: true, statusCode: 200};
        model.notifications = user.notifications.reverse();
        res.status(200).send(model)
    }).catch(next)


}

async function createNotifications(req, res, next) {
    if (req.method == "GET") {
        res.render('send-notification')
    } else if (req.method == "POST") {
        var title = req.body.header
        var message = req.body.message

        var notification = new notificationSchema({
            title: title,
            message: message
        });

        userSchema.find({registerStatus:userStatusEnums.userStatusEnum.CONFIRMED}).populate({
            path: 'installedApplication'
        })
            .then(async users => {

                await users.map(async user => {
                     await firebase.sendNotificationToDevice(title, message, user.installedApplication.pnsToken)
                })
                res.redirect('/admin/notifications')

            }).catch(next)


    }
}