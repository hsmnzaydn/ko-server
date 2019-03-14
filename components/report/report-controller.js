const reportSchema = require('./model/report-model')
      entrySchema=require('../report/model/report-model')


module.exports = {
    createReport,
    getReports
}


async function createReport(req, res, next) {
    var entryId=req.params.entryId
    var report = new reportSchema({
        header: req.body.header,
        message: req.body.message,
        user: res.userId,
        entry:entryId
    });


    report.save().then(report => {
        console.log("Create report", report)
        res.status(200).send({
            code: 200,
            message: 'OK'
        })
    })
}


async function getReports(req, res, next) {
    reportSchema.find().populate([{
        path: 'user'
    },
        {
            path:'entry'
        }])
        .then(reports => {
            res.render('reports', {
                reports: reports
            })
        })
}