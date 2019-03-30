const admin = require('firebase-admin');


module.exports = {
    sendNotificationToAll,
    sendNotificationToDevice
}

async function sendNotificationToAll(title, body) {
    var message = {
        data: {
            title: title,
            body: body
        },
        token: process.env.REGISTRATION_TOKEN
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}



async function sendNotificationToDevice(title, body, registrationToken) {
/*
    const payload = {
        notification: {
            title: title,
            body: body,
        },
        android: {
            notification: {
                sound: 'default'
            },
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default'
                },
            },
        },
        topic: 'X'
    };*/

    const payload = {
        'notification': {
            'title': title,
            'body': body,
            'sound': 'default'

        }
    };


    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(registrationToken, payload,options)
        .then(function (response) {
            console.log('Successfully sent message:', response);
        })
        .catch(function (error) {
            console.log('Error sending message:', error);
        });
}