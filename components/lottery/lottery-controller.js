const lotterySchema = require('./model/lottery-model');
userSchema = require('../user/model/user_model');
Constant = require('../../Utils/Constants')
fs = require('fs');

module.exports = {
    getLotteries,
    getLotteryDetail,
    addParticipants,
    getLotteriesAdmin,
    createLotteries,
    getParticipants,
    editLotteries,
    deleteLotteries
};


async function getLotteries(req, res, next) {
    lotterySchema.find({},['createdDate','endDate','winner','_id','header','description']).then(lotteries => {
        model={isSuccess:true,statusCode:200}
        model.lotteries=lotteries.reverse();
        res.status(200).send(model);
    }).catch(next)
}

async function getLotteryDetail(req, res, next) {
    var lotteryId = req.params.lotteryId;

    lotterySchema.findOne({_id: lotteryId}).populate({
        path: 'participants',select:['nickname']
    })
        .then(lottery => {
            model={isSuccess:true,statusCode:200}
            model.lottery = lottery;
            res.status(200).send(model)
        }).catch(next)

}

async function addParticipants(req, res, next) {
    var lotteryId = req.params.lotteryId;
    var userId = res.userId;


    lotterySchema.findOne({_id: lotteryId}).then(lottery => {
        var isExist=false;
        lottery.participants.map(async participant => {
            if (participant._id.toString() === userId.toString()) {
                isExist=true
            }
        })

        if(!isExist){
            lottery.participants.push(userId);
            lottery.save();

            res.status(global.OK_CODE).send({
                message: global.OK_MESSAGE,
                code: global.OK_CODE
            })

        }else {
            res.status(405).send({
                message: "Bu çekilişe daha önce katılmışsınız",
                code: 405
            })
        }

    }).catch(next)
}

async function getLotteriesAdmin(req, res, next) {
    lotterySchema.find().then(lotteries => {
        res.render('lotteries', {
            lotteries: lotteries
        })
    }).catch(next)
}

async function createLotteries(req, res, next) {
    if (req.method == "GET") {
        res.render('add-lotteries')
    }
    if (req.method == "POST") {
        var header = req.body.header;
        var description = req.body.description;

        var lottery = new lotterySchema({
            header: header,
            description: description
        })

        lottery.save().then(lottery => {
            res.redirect('/admin/lotteries')
        }).catch(next)

    }
}

async function getParticipants(req, res, next) {
    var lotteryId = req.params.lotteryId;

    lotterySchema.findOne({_id: lotteryId}).populate({
        path: 'participants'
    })
        .then(lottery => {
            var data = "";
            lottery.participants.map(participant => {
                data = data + "\n" + participant.nickname;
            });
            return data
        }).then(data => {
        var file = "public/" + Date.now() + ".csv";
        fs.writeFile(file, data, function (err) {
            if (err) {
                return console.log(err);
            }

            res.download(file)
        });
    }).catch(next)

}

async function editLotteries(req, res, next) {
    var lotteryId = req.params.lotteryId;

    if (req.method == "GET") {
        lotterySchema.findOne({_id: lotteryId}).then(lottery => {
            res.render('edit-lotteries', {
                lottery: lottery
            })
        })
    }
    if (req.method == "POST") {
        lotterySchema.findOne({_id: lotteryId}).then(lottery => {
            lottery.header = req.body.header;
            lottery.description = req.body.description;
            lottery.winner = req.body.winner;
            lottery.save();
            res.redirect('/admin/lotteries')
        }).catch(next)
    }

}

async function deleteLotteries(req, res, next) {
    var lotteryId = req.params.lotteryId;

    lotterySchema.deleteOne({_id: lotteryId}).then(value => {
        res.redirect('/admin/lotteries')
    }).catch(next)
}