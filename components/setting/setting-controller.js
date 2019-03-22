const Constant = require('../../Utils/Constants');
userSchema = require('../../components/user/model/user_model');
serverSchema = require('../../components/server/model/server-model')
settingSchema=require('../../components/setting/model/setting-model');

module.exports = {
    getEvents,
    getSettings,
    addSettings
}


async function getEvents(req, res, next) {

    res.status(200).send(global.EVENTS)

}


async function getSettings(req, res, next) {
    var userId = res.userId;

    userSchema.findOne({_id: userId}).populate({
        path: 'settings',
        populate: {path: 'servers', model: 'Server',select:['_id','name']}

    }).then(user => {
        serverSchema.find().then(async servers => {
            var withOutReferanceServer = JSON.parse(JSON.stringify(servers));

            await withOutReferanceServer.map(async server => {
                await user.settings.servers.map(async settingServer => {
                    if (settingServer._id.toString() == server._id.toString()) {
                        server.isLiked = true;
                    }
                });
                if (server.isLiked == undefined) {
                    server.isLiked = false
                }
            });

            model = {isSuccess: true, statusCode: 200}
            model.settings = withOutReferanceServer
            res.status(200).send(model)

        }).catch(next)
    }).catch(next)

}

async function addSettings(req, res, next) {
    var userId = res.userId;

    await userSchema.findOne({_id: userId}).then( async user => {
        var settingId=user.settings._id.toString();

        await settingSchema.findOne({_id: settingId}).then(async setting => {
            setting.servers = req.body
            setting.save()

            res.status(200).send({
                code:200,
                message:"OK"
            })
        })

    }).catch(next)

}