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
    //  return (Math.random()*8888+1000).toString()
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
}

global.sendSMSFromCheckMobiToUser = function (code,phoneNumber) {

    

    var request = require('request');
    request(
        {
            method: 'POST',
            url: 'https://api.checkmobi.com/v1/sms/send',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "23B41065-6895-4093-9C58-26099ADD9DAB"
            },
            body: {
                "to": (phoneNumber.length == 11 ? "+9" + phoneNumber : phoneNumber),
                "text": "Floody için doğrulama kodu: " + code,
                "platform": "web"
            },
            json: true
        },
        function (error, response, body) {
            if(error == undefined){
                console.log(error)
            }
        }
    );

    return code
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

global.findDayOfWeek = function (eventDay) {
    switch (eventDay) {
        case "Monday":
            return 1
        case "Tuesday":
            return 2
        case "Wednesday":
            return 3
        case "Thursday":
            return 4
        case "Friday":
            return 5
        case "Saturday":
            return 6
        case "Sunday":
            return 0
    }
}
