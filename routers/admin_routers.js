var express = require('express')
router = express.Router();
constant = require('../Utils/Constants')

passport = require('passport')
redirect = require('connect-ensure-login').ensureLoggedIn('/admin')

adminController = require('../components/admin/admin-controller')
router.get('', adminController.login)
router.post('', passport.authenticate('local', {
    successRedirect: '/admin/users',
    failureRedirect: '/admin',
    failureFlash: 'Invalid username or password.'
}));


userContoller = require('../components/user/user-controller');
router.get('/users', redirect, userContoller.getUsers);
router.get('/users/:userId/edit', redirect, userContoller.userUpdate);
router.post('/users/:userId/edit', redirect, userContoller.userUpdate);
router.get('/users/:userId/notifications', redirect, userContoller.sendNotification);
router.post('/users/:userId/notifications', redirect, userContoller.sendNotification);


serverController = require('../components/server/server-controller');
router.get('/servers', redirect, serverController.getServersAdmin);
router.get('/servers/add', redirect, serverController.createServer);
router.post('/servers/add', redirect, serverController.createServer);
router.get('/servers/:serverId/edit', redirect, serverController.editServer);
router.post('/servers/:serverId/edit', redirect, serverController.editServer);
router.get('/servers/:serverId/delete', redirect, serverController.deleteServer);


entryController = require('../components/entry/entry-controller');
router.get('/entries', redirect, entryController.getEntries)
router.get('/entries/:entryId/edit', redirect, entryController.entryUpdate)
router.post('/entries/:entryId/edit', redirect, entryController.entryUpdate)
router.get('/entries/:entryId/confirme', redirect, entryController.entryConfirme)



notificationController = require('../components/notification/notification-controller');
router.get('/notifications', redirect, notificationController.getNotificationsAdmin);
router.get('/notifications/add', redirect, notificationController.createNotifications)
router.post('/notifications/add', redirect, notificationController.createNotifications)


intermediarisController = require('../components/intermediaris/intermediaris-controller');
router.get('/intermediaris', redirect, intermediarisController.getIntermediariesAdmin);
router.post('/intermediaris', redirect, intermediarisController.getIntermediariesAdmin);

promotionController=require('../components/promotion/promotion-controller');
router.get('/promotions',redirect,promotionController.getPromotionsAdmin);
router.get('/promotions/add',redirect,promotionController.addPromotions);
router.post('/promotions/add',redirect,promotionController.addPromotions);
router.get('/promotions/:promotionId/delete',redirect,promotionController.deletePromotions)
router.get('/promotions/:promotionId/edit',redirect,promotionController.promotionUpdate)
router.post('/promotions/:promotionId/edit',redirect,promotionController.promotionUpdate)


agreementController=require('../components/agreement/agreement-controller');
router.get('/agreement',redirect,agreementController.agreementAdmin)
router.post('/agreement',redirect,agreementController.agreementAdmin)


reportsController=require('../components/report/report-controller');
router.get('/reports',redirect,reportsController.getReports);
module.exports = router;

lotteriesController=require('../components/lottery/lottery-controller');
router.get('/lotteries',redirect,lotteriesController.getLotteriesAdmin);
router.get('/lotteries/add',redirect,lotteriesController.createLotteries)
router.post('/lotteries/add',redirect,lotteriesController.createLotteries)
router.get('/lotteries/:lotteryId/participants',redirect,lotteriesController.getParticipants)
router.get('/lotteries/:lotteryId/edit',redirect,lotteriesController.editLotteries)
router.post('/lotteries/:lotteryId/edit',redirect,lotteriesController.editLotteries)
router.get('/lotteries/:lotteryId/delete',redirect,lotteriesController.deleteLotteries);