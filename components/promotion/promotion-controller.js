const promotionSchema = require('./model/promotion-model')
coinSchema = require('../coin/model/coin-model');
Constant=require('../../Utils/Constants')

module.exports = {
    getPromotions,
    getPromotionsAdmin,
    addPromotions,
    deletePromotions,
    promotionUpdate
}


async function getPromotions(req, res, next) {
    promotionSchema.find().populate({
        path: 'coin'
    }).then(promotions => {
        model={isSuccess:true,statusCode:200}
        model.promotions=promotions;
        model.statusCode = 200

        res.status(200).send(model)
    }).catch(next)
}

async function getPromotionsAdmin(req, res, next) {
    promotionSchema.find().populate({
        path: 'coin'
    }).then(promotions => {
        res.render('promotions', {
            promotions: promotions
        })
    }).catch(next)
}

async function addPromotions(req, res, next) {
    if (req.method == "GET") {
        res.render('add-promotions.ejs')
    } else if (req.method == "POST") {
        var name = req.body.name;
        var coin = req.body.coin;
        var price = req.body.price;
        var description = req.body.description;

        var coin = new coinSchema({
            value: coin
        });
        coin.save();
        var promotion = new promotionSchema({
            name: name,
            coin: coin._id,
            price: price,
            description: description

        });

        promotion.save().then(promition => {
            res.redirect('/admin/promotions')
        })

    }

}

async function deletePromotions(req, res, next) {
    var promotionId = req.params.promotionId

    promotionSchema.deleteOne({_id: promotionId}).then(err => {
        res.redirect('/admin/promotions')
    }).catch(next)
}

async function promotionUpdate(req, res, next) {
    var promotionId = req.params.promotionId

    if (req.method == "GET") {
        promotionSchema.findOne({_id: promotionId}).populate({
            path: 'coin'
        })
            .then(promotion => {
                res.render('edit-promotions', {
                    promotion: promotion
                })
            })
    } else if (req.method == "POST") {
        var name = req.body.name
        var description = req.body.description
        var coinValue = req.body.coin
        var price = req.body.price

        promotionSchema.findOne({_id: promotionId}).populate({
            path: 'coin'
        }).then(promotion => {

            promotion.name=name;
            promotion.description=description;
            promotion.price=price
            promotion.save()
            return promotion;
        }).then(promotion=>{
            coinSchema.findOne({_id:promotion.coin._id}).then(coin=>{
                coin.value=coinValue;
                coin.save()
                res.redirect('/admin/promotions')
            })
        }).catch(next)
    }
}