const agreementSchema = require('./model/agreement-model')
module.exports = {
    agreement,
    agreementAdmin
}


async function agreement(req, res, next) {
    agreementSchema.find().then(agreement => {
        res.status(200).send(agreement[0])
    })
}

async function agreementAdmin(req, res, next) {
    if (req.method == "GET") {
        agreementSchema.find().then(agreement => {

            res.render('agreement', {
                agreement: agreement[0]
            })
        });
    } else if (req.method == "POST") {
        var header = req.body.agreementHeader;
        var message = req.body.agreementMessage;

        agreementSchema.find().then(agreement => {

            agreement[0].header = header;
            agreement[0].message = message;
            agreement[0].save();


            res.redirect('/admin/agreement')
        }).catch(next)


    }
}