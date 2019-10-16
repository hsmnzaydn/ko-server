const messageSchema=require('../message/model/message_model')
const conversationSchema=require('../conversation/model/conversation_model')
const entrySchema=require('../entry/model/entry-model')
const userSchema=require('../user/model/user_model')

module.exports={
    createConversation,
    getMessages,
    sendMessage
}

async function createConversation(req,res,next) {
    var userId=res.userId.toString()
    var entryId = req.body.entryId

    conversationSchema.find({$or: [
        {userId: userId},
        {entry: entryId}
    ]}).
    then(async conversation=>{
        if (conversation.length == 0) {

            var ownerId = await entrySchema.findOne({_id:entryId}).then(async entry=>{
                return entry.creator._id
            })
            conversationModel = new conversationSchema({
                userId:userId,
                ownerId: ownerId,
                entry:entryId
            })
            conversationModel.save()
        }
        res.status(global.OK_CODE).send({
            code:global.OK_CODE,
            conversationId:conversationModel._id
        })
    }).catch(next)
    

}


async function getMessages(req,res,next) {
    var conversationId=req.params.conversationId

    messageSchema.find({conversationId:conversationId}).sort({date:1}).
    then(async messages=>{
        res.status(global.OK_CODE).send({
            code:global.OK_CODE,
            messages:messages
        })
    }).catch(next)
    

}

async function sendMessage(req,res,next) {
    var conversationId=req.params.conversationId
    var senderUserId=res.userId.toString()
    var message=req.body.message

    messageSchema.find({conversationId:conversationId}).then(async messages=>{
        messageModel = new messageSchema({
            conversationId: conversationId,
            user: senderUserId,
            message: message,
            date: Date.now().toString()
        })
        messageModel.save()
    
        userSchema.findOne({_id:senderUserId}).then(async user=>{
            var sendMessageModel = {
                senderUser: senderUserId,
                message: message
            }
            await firebaseUtility.sendMessageNotificationToDevice(sendMessageModel, "Yeni bir mesajınız var", user.nickname+" kişisinden mesaj var", user.installedApplication.pnsToken)
        })

        res.status(global.OK_CODE).send({
            code:global.OK_CODE,
            message:global.OK_MESSAGE
        })

    }).catch(next)
    

}