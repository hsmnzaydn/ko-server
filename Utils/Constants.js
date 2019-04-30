global.API_BASE_PATH = '/api';

// API ENDPOINTS
global.API_SECURE_BASE_PATH = '/secure';
global.APT_SECURE_START_APPLICATION = global.API_SECURE_BASE_PATH + '/start-application';

global.API_USER_BASE_PATH = '/users';
global.API_SECURE_USER_BASE_PATH = global.API_SECURE_BASE_PATH + '/users';


// ADMIN ENDPOINTS
global.ADMIN_BASE_PATH = '/admin'

// Startapplication alternatives
global.EXIST_USER_CODE = 450;
global.EXIST_USER_MESSAGE = "Zaten böyle bir kullanıcı bulunmaktadır. Lütfen şifrenizi ve telefon numaranızı kontrol ediniz"

global.ERROR_SMS_CODE = 451
global.ERROR_SMS_MESSAGE = "Yanlış sms kodunu girdiniz, lütfen kontrol ediniz"

global.UNREGISTER_CODE = 401;
global.UNREGISTER_MESSAGE = "Kullanıcı adınız veya şifreniz yanlış";

global.WAITING_VALIDATION_CODE = 452;
global.WAITING_VALIDATION_MESSAGE = "Hesabınızı doğrulamanız gerekmektedir";


global.NO_ENOUGH_COIN_CODE = 456;
global.NO_ENOUGH_COIN_MESSAGE = "Yeterli bakiyeniz bulunmamaktadır. Lütfen Coin alınız";

// Server Response alternatives
global.OK_CODE = 200;
global.OK_MESSAGE = 'OK';

global.ERROR_CODE = 500;
global.ERROR_MESSAGE = 'There is a problem at server'


// MAIL CONTENTS
global.MAIL_SUBJECT = 'Articelp';
global.MAIL_TEXT = 'Hi, \n If you want confirmed account you have to click to under link \n';


// ABSTRACT OBJECT
global.model = {isSuccess: true, statusCode: 200}

// Message
global.UNCONFIRMED_ENTRY_TITLE = 'Gönderiniz Kabul Edilmedi'
global.UNCONFIRMED_ENTRY_DESCRIPTION = 'Lütfen gönderinizi düzenleyin'

global.CONFIRMED_ENTRY_TITLE = 'Gönderiniz Kabul Edildi'
global.CONFIRMED_ENTRY_DESCRIPTION = 'Tebrikler, gönderiniz onaylandı'


// STATIC DATA
global.EVENTS =
    {
        events: [
            {
                eventName: "Chaos",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["23:45", "11:45", "18:45"]
            },
            {
                eventName: "Border Defense War",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["01:45", "12:45", "22:45"]
            },
            {
                eventName: "Bifrost",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["01:45", "13:45", "20:45"]
            },
            {
                eventName: "Forgotten Temple 60-83",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["02:45", "21:45"]
            },
            {
                eventName: "Forgotten Temple 46-59",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["08:45", "18:45"]
            },
            {
                eventName: "Juraid Mountain",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["06:25", "22:25"]
            },
            {
                eventName: "Krowaz",
                eventDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                eventHours: ["9:45", "20:45"]
            },
            {
                eventName: "Lunar War",
                eventDays: ["Monday", "Saturday"],
                eventHours: ["05:45", "13:45", "19:45"]
            },
            {
                eventName: "Dark Lunar War",
                eventDays: ["Wednesday"],
                eventHours: ["05:45", "13:45", "19:45"]
            },
            {
                eventName: "Castle Siege War",
                eventDays: ["Sunday"],
                eventHours: ["20:15"]
            },
            {
                eventName: "Under The Castle",
                eventDays: ["Friday"],
                eventHours: ["20:45"]
            }
        ]
    }
 