const notificationSchema=require('./model/notification-model');
      firebase=require('../../Utils/firebase')
      Constant=require('../../Utils/Constants')

module.exports={
    getNotificationsAdmin,
    createNotifications,
    getNotifications
}

async function getNotificationsAdmin(req,res,next) {
    notificationSchema.find().then(notifications=>{
        res.render('bildirimler',{
            notifications:notifications
        })
    })
}

async function getNotifications(req,res,next) {
    notificationSchema.find().then(notifications=>{
        var notificationList=[];


        notifications.map(notification=>{
            var withOutReferanceNotification = JSON.parse(JSON.stringify(notification));

            delete withOutReferanceNotification.users
            notificationList.push(withOutReferanceNotification)
        })

        return notificationList;

    }).then(notifications=>{
        model={isSuccess:true,statusCode:200}
        model.notifications=notifications;
        res.status(200).send(global.model)
    }).catch(next)
}

async function createNotifications(req,res,next) {
    if(req.method=="GET"){
        res.render('send-notification')
    }else if(req.method=="POST"){
        var title=req.body.header
        var message=req.body.message

        var notification=new notificationSchema({
            title:title,
            message:message
        })
        notification.save().then(notification=>{
            firebase.sendNotificationToAll(title,message)
            res.redirect('/admin/notifications')
        }).catch(next)

    }
}