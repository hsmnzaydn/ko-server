require('dotenv').config({
    path: '../process.env'
});


var request = require('request');
fs = require('fs');

global.saveImageMultiPart = function (image, fileName, next) {
    image.mv('./resources/upload/' + fileName, function (err) {
        if (err) {
            next(err)
        }
    });
};


global.sendSmsToUser = function (smsCode, receiptNumber) {
    request
}

global.createRandomCode = function () {
    //return Math.random().toString(36).substring(7)
    return 1234
}


global.saveImage = function (base64, imageName) {
    var base64Data = base64.replace(/^data:image\/png;base64,/, "");

    fs.writeFile("public/resources/" + imageName, base64Data, 'base64', function (err) {
        if (err) {
            fs.close();
        }
    });
};

global.addPathToImageList = function (photoUrl) {
    photoUrl = process.env.BASE_URL + photoUrl;
    return photoUrl;
};