const entrySchema = require('./model/entry-model')
entryEnums = require('./enums')
userSchema = require('../user/model/user_model');
notificationSchema = require('../notification/model/notification-model');
serverSchema = require('../server/model/server-model')
Constant = require('../../Utils/Constants')
firebaseUtility = require('../../Utils/firebase')
coinSchema = require('../coin/model/coin-model')
const conversationSchema=require('../conversation/model/conversation_model')
messageSchema=require('../message/model/message_model')
require('dotenv').config({
    path: './.env'
});

module.exports = {
    getEntries,
    getEntriesApi,
    entryUpdate,
    entryDelete,
    entryConfirme,
    updateEntry,
    getEntry,
    getMessages,
    sendMessage
}


async function getEntries(req, res, next) {
    entrySchema.find().populate([
        {path: 'server'},
        {path: 'creator'}
    ])
        .then(entries => {
            res.render('entries', {
                entries: entries.reverse()
            })

            res.status(200).send(entries)
        }).catch(next)
}

async function getEntriesApi(req, res, next) {

    entrySchema.find({
        status: entryEnums.entryStatusEnum.CONFIRMED,
        isDisable: false
    }, ['price', 'createdDate', 'entryImageUrl', '_id', 'header', 'message']).then(async entries => {


        await entries.map(entry => {
            entry.entryImageUrl = process.env.BASE_URL + entry.entryImageUrl;
            entry.entryImageUrl.replace('\"','')
            entry.entryImageUrl.replace('"', '')

        });

        return entries
    }).then(entries => {
        model = {isSuccess: true, statusCode: 200}
        model.entries = entries.reverse();
        model.statusCode = 200
        res.status(200).send(model)

    }).catch(next)

}


async function entryUpdate(req, res, next) {
    var entryId = req.params.entryId

    if (req.method == "GET") {
        entrySchema.findOne({_id: entryId}).then(entry => {
            res.render('entry-edit', {
                entry: entry
            })
        }).catch(next)
    } else if (req.method == "POST") {
        var header = req.body.entryHeader;
        var message = req.body.entryMessage;
        var status = req.body.entryStatus;

        entrySchema.findOne({_id: entryId}).populate([{
            path: "creator",
            populate: [{
                path: "installedApplication",
                model: "InstalledApplication"
            },{
                path: "coin",
                model: "Coin"
            }]
        }, {
            path: 'server', select: ['name']
        }])
            .then(entry => {
                entry.header = header;
                entry.message = message;
                entry.status = status;

                return entry
            }).then(entry => {
            entry.save();
            return entry
        }).then(async entry => {
            var title;
            var message;
            if (entry.status == entryEnums.entryStatusEnum.UNCONFIRMED) {
                title = "Gönderiniz onaylanmadı";
                message = entry.header + " başlıklı ilanınız uygunsuz içerikten dolayı reddedilmiştir. Lütfen tekrar Flood girişi yapınız.";
                await coinSchema.updateMany({_id: entry.creator.coin}, {$set: {value: entry.creator.coin.value + 1}}).then(coin => {
                }).catch(next);
            } else if (entry.status == entryEnums.entryStatusEnum.CONFIRMED) {
                title = global.CONFIRMED_ENTRY_TITLE;
                message = global.CONFIRMED_ENTRY_DESCRIPTION;


                await settingSchema.find({servers: {$in: entry.server}}).populate({
                    path: 'user',
                    populate: {path: 'installedApplication', model: 'InstalledApplication'}
                }).then(async settings => {

                    await settings.map(setting => {
                        if (setting.user != null) {

                            if (setting.user._id.toString() != entry.creator._id.toString()) {
                                var title = "Yeni flood var";
                                var message = entry.server.name+":"+entry.header+" başlığıyla bir flood var";
                                firebaseUtility.sendEntryNotificationToDevice(entry._id.toString(), title, message, setting.user.installedApplication.pnsToken)
                            }
                        }

                    })

                });
            }

            firebase.sendNotificationToDevice(title, message, entry.creator.installedApplication.pnsToken)

            var returnValue = {
                entry: entry,
                notificationTitle: title,
                notificationMessage: message
            }
            return returnValue;
        }).then(async returnValue => {

           await userSchema.findOne({_id: returnValue.entry.creator}).then(user => {
                var notification = new notificationSchema({
                    title: returnValue.notificationTitle,
                    message: returnValue.notificationMessage
                })
                notification.save()
                user.notifications.push(notification)
                user.save()
                res.redirect('/admin/entries')
            })
        }).catch(next)

    }

}

async function entryDelete(req, res, next) {
    var entryId = req.params.entryId
    entrySchema.findOne({_id: entryId}).then(entry => {
        entry.isDisable = true;

        return entry
    }).then(entry => {
        entry.save()
        res.status(global.OK_CODE).send({
            code: global.OK_CODE,
            message: global.OK_MESSAGE
        })
    }).catch(next)
}

async function entryConfirme(req, res, next) {
    var entryId = req.params.entryId
    entrySchema.findOne({_id: entryId}).then(entry => {
        entry.status = entryEnums.entryStatusEnum.CONFIRMED;

        return entry
    }).then(entry => {
        entry.save()
        res.redirect('/admin/entries')
    }).catch(next)
}

async function updateEntry(req, res, next) {
    var entryId = req.params.entryId


    entrySchema.findOne({_id: entryId}).populate({
        path: 'creator',
        populate: {
            path: 'coin'
        }
    }).then(async entry => {
        entry.header = req.body.header;
        entry.message = req.body.message;
        entry.price = req.body.price;
        entry.server = req.body.server._id;
        entry.status = entryEnums.entryStatusEnum.CONFIRMED;


        return entry
    }).then(entry => {
        entry.save()
        res.status(global.OK_CODE).send({
            code: global.OK_CODE,
            message: global.OK_MESSAGE
        })

    }).catch(next)

}

async function getEntry(req, res, next) {
    var entryId = req.params.entryId
    entrySchema.findOne({_id: entryId}, ['createdDate', 'entryImageUrl', '_id', 'header', 'message', 'price']).populate([{
        path: 'creator', select: ['name', 'surname', 'nickname', 'phoneNumber', 'isShowPhoneNumber']
    }, {
        path: 'server', select: ['name', '_id']
    }])
        .then(entry => {
            entry.entryImageUrl = process.env.BASE_URL + entry.entryImageUrl
            res.status(global.OK_CODE).send(entry)

        }).catch(next)

}

async function getMessages(req,res,next) {
    var entryId=req.params.entryId
    var senderUserId=res.userId

    entrySchema.findOne({_id:entryId}).
    populate({
        path:'creator'
    }).
    then(async entry=>{
        await userSchema.findOne({_id:entry.creator}).
        populate({
            path: 'conversations',
            match: {user:senderUserId},
            populate:{
                path :'messages',
                model: 'Message'
            }
        })
        .then(async user=>{
           /* await user.conversations.map(async conversation=>{
                    if(conversation.user._id == senderUserId){
                        res.send(global.OK_CODE).send({
                            code:global.OK_CODE,
                            messages:conversation.messages
                        })
                        break;
                    }
            })*/

            if(user.conversations.length >0 ){
                res.status(global.OK_CODE).send({
                    code:global.OK_CODE,
                    messages:user.conversations[0].messages
                })
            
            }else{
                res.status(global.OK_CODE).send({
                    code:global.OK_CODE,
                    messages:[]
                })
            
            }
           
            
        }).catch(next)

    }).catch(next)
    

}

async function sendMessage(req,res,next) {
    var entryId=req.params.entryId
    var senderUserId=res.userId.toString()
    var message=req.body.message

    entrySchema.findOne({_id:entryId}).
    populate({
        path:'creator'
    }).
    then(async entry=>{
        await userSchema.findOne({_id:entry.creator}).
        populate([{
            path: 'conversations',
            match: {user:senderUserId},
            populate:{
                path :'messages',
                model: 'Message'
            }
        },{
            path: 'installedApplication'
        }])
        .then(async user=>{
            if(user.conversations.length == 0){
                var conversationObject = new conversationSchema({
                    user:senderUserId,
                    entry: entry._id
                })

                var messageModel=new messageSchema({
                    user:senderUserId,
                    message:message
                })

                conversationObject.messages.push(messageModel)
                await conversationObject.save()
                await messageModel.save()
                await user.conversations.push(conversationObject)
                await user.save()
              

            }else{
                await conversationSchema.findOne({_id:user.conversations[0]._id}).then(async conversation=>{
                
                    var messageModel=new messageSchema({
                        user:senderUserId,
                        message:message
                    })

                    conversation.messages.push(messageModel)
                    await messageModel.save()
                    await conversation.save()

                   }).catch(next)
            }
            var sendMessageModel = {
                senderUser: user.nickname,
                message: message
            }

           await firebaseUtility.sendMessageNotificationToDevice(sendMessageModel, "Yeni bir mesajınız var", user.name+" kişisinden mesaj var", user.installedApplication.pnsToken)

           res.status(global.OK_CODE).send({
            code:global.OK_CODE,
            message:global.OK_MESSAGE
        })

            
          


            
        }).catch(next)

    }).catch(next)
    

}