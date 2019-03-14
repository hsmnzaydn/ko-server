const serverSchema = require('./model/server-model')
const entrySchema = require('../entry/model/entry-model')
const userSchema = require('../user/model/user_model')
const entryEnums = require('../entry/enums');
const uuid = require('uuid/v1');
const Utility = require('../../Utils/Utility');
const Constant = require('../../Utils/Constants')

require('dotenv').config({
    path: './process.env'
});

module.exports = {
    getServers,
    createEntry,
    getEntries,
    createServer,
    getServersAdmin,
    editServer,
    deleteServer
}

async function getServers(req, res, next) {
    serverSchema.find().then(servers => {
        var serverList = []
        servers.map(server => {
            var withOutReferanceServer = JSON.parse(JSON.stringify(server));
            delete withOutReferanceServer.entries
            serverList.push(withOutReferanceServer)

        })
        return serverList

    }).then(servers => {
        model={isSuccess:true,statusCode:200}
        model.servers = servers;
        model.statusCode = 200
        res.status(200).send(model)
    }).catch(next)
}

async function getServersAdmin(req, res, next) {
    serverSchema.find().then(servers => {
        res.render('servers', {
            servers: servers
        })
    })
}

async function createServer(req, res, next) {
    if (req.method == 'GET') {
        res.render('add-servers');
    } else if (req.method == 'POST') {
        var serverName = req.body.servername;

        var server = new serverSchema({
            name: serverName
        })

        server.save().then(server => {
            res.redirect('/admin/servers')
        }).catch(next)
    }


}


async function createEntry(req, res, next) {
    var serverId = req.params.serverId;
    var imageName = uuid() + ".png";
    global.saveImage(req.body.imageBase64, imageName);

     const entry = new entrySchema({
        header: req.body.header,
        message: req.body.message,
        creator: res.userId,
        server: serverId,
        status: entryEnums.entryStatusEnum.UNCONFIRMED,
        price: req.body.price,
        entryImageUrl: process.env.RESOURCES_PATH + imageName
    });



    entry.save().then(entry => {
        userSchema.findOne({_id: res.userId}).then(user => {
            user.entries.push(entry._id);
            user.save();

            serverSchema.findOne({_id: entry.server.toString()}).then(server => {
                server.entries.push(entry._id);
                server.save()

                res.status(200).send({
                    code: 200,
                    message: 'OK'
                })
            }).catch(next);

        });

    }).catch(next)
}

async function getEntries(req, res, next) {
    var serverId = req.params.serverId;
    entrySchema.find({
        server: serverId
    }).populate([
        {path: 'server'},
        {path: 'creator'}
    ])
        .then(entries => {
            var entryList = [];

            entries.map(async entry => {
                var withOutReferanceEntry = JSON.parse(JSON.stringify(entry));
                delete withOutReferanceEntry.creator.installedApplication;
                delete withOutReferanceEntry.creator.registerServer;
                delete withOutReferanceEntry.creator.coin
                delete withOutReferanceEntry.creator.entries
                delete withOutReferanceEntry.creator.password
                delete withOutReferanceEntry.creator.registerStatus
                delete withOutReferanceEntry.creator.smsCode
                delete withOutReferanceEntry.server

                withOutReferanceEntry.entryImageUrl = global.addPathToImageList(entry.entryImageUrl)

                if (entry.status == entryEnums.entryStatusEnum.CONFIRMED && !entry.isDisable) {
                    entryList.push(withOutReferanceEntry)
                }
            });
            return entryList

        }).then(entries => {
        model = {isSuccess: true, statusCode: 200}
        model.entries = entries.reverse();
        res.status(200).send(model)
    }).catch(next)
}


async function editServer(req, res, next) {
    var serverId = req.params.serverId
    if (req.method == "GET") {
        serverSchema.findOne({_id: serverId}).then(server => {
            res.render('edit-servers', {
                server: server
            })
        }).catch(next)
    } else if (req.method == "POST") {
        var serverName = req.body.servername

        serverSchema.findOne({_id: serverId}).then(server => {
            server.name = serverName
            server.save()
            res.redirect('/admin/servers')

        }).catch(next)


    }
}

async function deleteServer(req, res, next) {
    var serverId = req.params.serverId
    serverSchema.deleteOne({_id: serverId}).then(err => {
        res.redirect('/admin/servers')
    })
}