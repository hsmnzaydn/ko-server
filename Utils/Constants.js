 global.API_BASE_PATH='/api';

// API ENDPOINTS
 global.API_SECURE_BASE_PATH='/secure';
 global.APT_SECURE_START_APPLICATION=global.API_SECURE_BASE_PATH+'/start-application';

 global.API_USER_BASE_PATH='/users';
 global.API_SECURE_USER_BASE_PATH=global.API_SECURE_BASE_PATH+'/users';
 

// ADMIN ENDPOINTS
global.ADMIN_BASE_PATH='/admin'
 
// Startapplication alternatives
global.WAIT_CODE=450;
global.WAIT_MESSAGE="Please check your mail"

 global.ERROR_SMS_CODE=451
 global.ERROR_SMS_MESSAGE="Yanlış sms kodunu girdiniz, lütfen kontrol ediniz"

global.UNREGISTER_CODE=401;
global.UNREGISTER_MESSAGE="Bu kullanıcı bulunamadı";

global.WAITING_VALIDATION_CODE=452;
global.WAITING_VALIDATION_MESSAGE="Zaten böyle bir kullanıcı bulunmaktadır. Lütfen şifrenizi ve telefon numaranızı kontrol ediniz"

// Server Response alternatives
global.OK_CODE=200;
global.OK_MESSAGE='OK';

global.ERROR_CODE=500;
global.ERROR_MESSAGE='There is a problem at server'



// MAIL CONTENTS
global.MAIL_SUBJECT='Articelp';
global.MAIL_TEXT='Hi, \n If you want confirmed account you have to click to under link \n';


// ABSTRACT OBJECT
 global.model={isSuccess:true,statusCode:200}

// Message
 global.UNCONFIRMED_ENTRY_TITLE='Gönderiniz Kabul Edilmedi'
 global.UNCONFIRMED_ENTRY_DESCRIPTION='Lütfen gönderinizi düzenleyin'

 global.CONFIRMED_ENTRY_TITLE='Gönderiniz Kabul Edildi'
 global.CONFIRMED_ENTRY_DESCRIPTION='Tebrikler, gönderiniz onaylandı'