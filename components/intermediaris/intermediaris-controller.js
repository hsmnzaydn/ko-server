const intermediariesSchema = require('./model/intermediaris-model')
      Constant=require('../../Utils/Constants')

module.exports = {
    getIntermediaries,
    getIntermediariesAdmin
}


async function getIntermediaries(req, res, next) {
    intermediariesSchema.find().then(intermediaries => {

        res.status(200).send(intermediaries[0]);
    }).catch(next)
}


async function getIntermediariesAdmin(req, res, next) {
    if (req.method == "GET") {
        intermediariesSchema.find().then(intermediaries => {
            var intermediaris;
            if (intermediaries.length == 0) {
                intermediaris = new intermediariesSchema({
                    name: "Serkan",
                    phoneNumber: "05457878383"
                })

                intermediaris.save().then(intermediaris => {
                    res.render('intermediaris', {
                        intermediaris: intermediaris
                    })
                });
            } else {
                res.render('intermediaris', {
                    intermediaris: intermediaries[0]
                })

            }

        })
    } else if (req.method == "POST") {
        var name = req.body.userName
        var phoneNumber = req.body.phoneNumber

        intermediariesSchema.find().then(intermediaries => {
            intermediaries[0].name = name;
            intermediaries[0].phoneNumber = phoneNumber;
            return intermediaries[0]
        }).then(intermediaries => {
            intermediaries.save().then(intermediaries => {
                res.redirect('/admin/intermediaris')
            })
        }).catch(next)
    }

}


