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

    var payload = {
        data: {
            title: title,
            body: body
        }
    };
    admin.messaging().sendToDevice(registrationToken, payload)
        .then(function (response) {
            console.log('Successfully sent message:', response);
        })
        .catch(function (error) {
            console.log('Error sending message:', error);
        });
}