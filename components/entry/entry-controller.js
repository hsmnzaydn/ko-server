const entrySchema = require('./model/entry-model')
entryEnums = require('./enums')
userSchema = require('../user/model/user_model');
notificationSchema = require('../notification/model/notification-model');
serverSchema = require('../server/model/server-model')
Constant = require('../../Utils/Constants')
firebaseUtility = require('../../Utils/firebase')

require('dotenv').config({
    path: './process.env'
});

module.exports = {
    getEntries,
    getEntriesApi,
    entryUpdate,
    entryDelete,
    entryConfirme,
    updateEntry,
    getEntry
}


async function getEntries(req, res, next) {
    entrySchema.find().populate([
        {path: 'server'},
        {path: 'creator'}
    ])
        .then(entries => {
            res.render('entries', {
                entries: entries
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
            populate: {
                path: "installedApplication",
                model: "InstalledApplication"
            }
        },{
            path: 'server',select:['name']
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
                title = global.UNCONFIRMED_ENTRY_TITLE;
                message = global.UNCONFIRMED_ENTRY_DESCRIPTION;
            } else if (entry.status == entryEnums.entryStatusEnum.CONFIRMED) {
                title = global.CONFIRMED_ENTRY_TITLE;
                message = global.CONFIRMED_ENTRY_DESCRIPTION;


                await settingSchema.find({servers: {$in: entry.server}}).populate({
                    path: 'user',
                    populate: {path: 'installedApplication', model: 'InstalledApplication'}
                }).then(settings => {

                    settings.map(setting => {
                        if (setting.user != null) {
                            var title = "Yeni gönderi";
                            var message = entry.server.name + " serverında yeni gönderiler var";
                            firebaseUtility.sendNotificationToDevice(title, message, setting.user.installedApplication.pnsToken)
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

            userSchema.findOne({_id: returnValue.entry.creator}).then(user => {
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

    var query = req.query.area

    entrySchema.findOne({_id: entryId}).then(entry => {
        if (query == "HEADER") {
            entry.header = req.body.header
        }
        if (query == "MESSAGE") {
            entry.message = req.body.message
        }
        if (query == "ENTRYIMAGE") {
            var imageName = uuid() + ".png";
            global.saveImage(req.body.imageBase64, imageName);
            entry.entryImageUrl = process.env.RESOURCES_PATH + imageName;
        }
        if (query == "PRICE") {
            entry.price = req.body.price
        }
        /*  if(query == "SERVER"){

          serverSchema.findOne({_id:entry.server}).then(server=>{
             var entries=[]
              server.entries.map(entryServer=>{
                  if(entry._id != entryServer._id){
                      entries.push(entryServer)
                  }
              })
              server.entries=entries
              server.save()

          });

              /*serverSchema.update({_id:entry.server},
                  { $pull: { 'entries':{'_id': entryId} }} );

              entry.server=req.body.server
          }*/
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
        path: 'creator', select: ['name', 'surname', 'nickname', 'phoneNumber']
    }, {
        path: 'server', select: ['name', '_id']
    }])
        .then(entry => {
            entry.entryImageUrl = process.env.BASE_URL + entry.entryImageUrl
            res.status(global.OK_CODE).send(entry)

        }).catch(next)

}