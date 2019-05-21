var express = require('express')
router = express.Router();
constant = require('../Utils/Constants')


// Logger
loggerController = require('../controller/logger')
router.use(loggerController.logger)

// Interceptor
intercepter = require('../controller/interceptor')
router.use(global.API_SECURE_BASE_PATH, intercepter.interceptor)

// Agreement
agreementController = require('../components/agreement/agreement-controller')
router.get('/agreement', agreementController.agreement)  // Yapıldı

// Login
loginController = require('../controller/login-controller')
router.post('/login', loginController.login) // Yapıldı

// Register
registerController = require('../controller/register-controller')
router.post('/register', registerController.register) // Yapıldı
router.get('/register', registerController.verificationUser) //Yapıldı
router.get('/smsSend',registerController.smsSend)

// Forget Password
forgetPasswordController = require('../controller/forget-password-controller')
router.get('/forget-password-step-one', forgetPasswordController.forgetPasswordStepOne)
router.get('/forget-password-step-two', forgetPasswordController.forgetPasswordStepTwo)
router.patch('/forget-password-step-three', forgetPasswordController.forgetPasswordStepThree)

//Server
serverController = require('../components/server/server-controller')
router.get('/servers', serverController.getServers) // Yapıldı
router.post('/secure/servers/:serverId/entries', serverController.createEntry)  // Yapıldı
router.get('/servers/:serverId/entries', serverController.getEntries)  // Yapıldı

//Entries
entryController = require('../components/entry/entry-controller')
router.get('/entries', entryController.getEntriesApi)  // Yapıldı
router.get('/entries/:entryId/detail',entryController.getEntry)
router.patch('/secure/entries/:entryId/delete',entryController.entryDelete)
router.post('/secure/entries/:entryId/update',entryController.updateEntry);

//Reports
reportController = require('../components/report/report-controller')
//router.post('/secure/reports', reportController.createReport) // Yapıldı
router.post('/secure/entries/:entryId/report', reportController.createReport)

//Promotions
promotionController = require('../components/promotion/promotion-controller')
router.get('/secure/promotions', promotionController.getPromotions) // Yapıldı

// Startapplication
controllersStartApplication = require('../controller/start-application')
router.get(global.APT_SECURE_START_APPLICATION, controllersStartApplication.startApplication)  // Yapıldı


//Settings
settingsController=require('../components/setting/setting-controller')
router.get('/getEvents',settingsController.getEvents)
router.get('/secure/users/me/settings',settingsController.getSettings);
router.post('/secure/users/me/settings',settingsController.addSettings);



// User Controllers
userControllers = require('../components/user/user-controller')
router.post(global.API_SECURE_USER_BASE_PATH, userControllers.registerUser) // Yapıldı
router.get('/secure/users/:userId/logout', userControllers.logout) // Yapılmadı
router.get('/secure/users/:userId/notifications', userControllers.getNotifications) // Yapılmadı
router.get('/secure/users/:userId/coins', userControllers.getCoins) // Yapıldı
router.get('/secure/users/:userId/detail', userControllers.getUser) // Yapıldı
router.patch('/secure/users/:userId/update', userControllers.userUpdate) // Yapılmadı
router.get('/secure/users/:userId/settings', userControllers.getUserSettings) // Yapılmadı
router.patch('/secure/users/:userId/settings', userControllers.updateSettings) // Yapılmadı
router.get('/secure/users/me',userControllers.getMe);
router.post('/secure/users/me/update',userControllers.updateMe);

// Intermediaries
intermediariesController = require('../components/intermediaris/intermediaris-controller')
router.get('/secure/intermediaries', intermediariesController.getIntermediaries)

// Notifications
notificationsController=require('../components/notification/notification-controller');
router.get('/secure/notifications',notificationsController.getNotifications)

// Lottery
lotteryController=require('../components/lottery/lottery-controller');
router.get('/secure/lotteries',lotteryController.getLotteries);
router.get('/secure/lotteries/:lotteryId',lotteryController.getLotteryDetail);
router.post('/secure/lotteries/:lotteryId',lotteryController.addParticipants);

// Event
eventsController=require('../components/events/event-controller');
router.get('/secure/users/:userId/events', eventsController.getEvents);
router.post('/secure/users/:userId/events', eventsController.eventsUpdate);

module.exports = router;