const eventSchema = require('./model/event-model');
userSchema = require('../user/model/user_model');
Constant = require('../../Utils/Constants')
hourSchema = require('../hour/hour-model')

fs = require('fs');

module.exports = {
    getEvents,
    eventsUpdate
};

async function getEvents(req, res, next) {
    var userId = res.userId;

    userSchema.findOne({
        _id: userId
    }).then(async user => {
        await eventSchema.find().
        populate({path:'eventHours'})
        .then(async events => {
            events.map(async event => {
                await event.eventHours.map(async eventHour => {
                    await user.selectedHours.map(userSelectedHour => {
                        if (eventHour._id.toString() == userSelectedHour._id.toString()) {
                            eventHour.isSelected = true
                        }

                    })
                })
            })
            model = {
                isSuccess: true,
                statusCode: 200
            }
            model.events = events;
            res.status(200).send(model);

        }).catch(next)

    }).catch(next)
}

async function eventsUpdate(req, res, next) {
    var userId = res.userId;

    userSchema.findOne({
        _id: userId
    }).then(user => {
        user.selectedHours = req.body.hourList
        user.save();

        res.status(200).send({
            code: 200,
            message: "OK"
        })
    }).catch(next)
}