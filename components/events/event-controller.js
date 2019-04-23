const eventSchema = require('./model/event-model');
userSchema = require('../user/model/user_model');
Constant = require('../../Utils/Constants')
fs = require('fs');

module.exports = {
    getEvents,
    eventsUpdate
};

async function getEvents(req, res, next) {
    var userId = res.userId;

    userSchema.findOne({_id: userId}).then(user => {
        model={isSuccess:true,statusCode:200}
        model.events= user.events;
        res.status(200).send(model);
    }).catch(next)
}

async function eventsUpdate(req, res, next) {
    var userId = res.userId;

    userSchema.findOne({_id: userId}).then(user => {
        user.events = req.body;
        user.save;
    }).catch(next)
}