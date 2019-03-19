const Constant=require('../../Utils/Constants')

module.exports={
    getEvents
}


async function getEvents(req,res,next) {

    res.status(200).send(global.EVENTS)

}