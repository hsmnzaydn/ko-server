const constant=require('../Utils/Constants');
      userSchema=require('../components/user/model/user_model');
      installedApplicationSchema=require('../components/user/model/installed_application_model');

module.exports={startApplication}

async function startApplication(req,res,next) {
    var pnsToken=req.query.pnsToken;
    var userId=res.userId

    userSchema.findOne({_id:userId}).then(user=>{
       installedApplicationSchema.findOne({_id:user.installedApplication._id}).then(installedApplication=>{
         installedApplication.pnsToken=pnsToken;
         installedApplication.save();
           res.send({
               code:global.OK_CODE,
               message:global.OK_MESSAGE
           })

       }).catch(next);
    }).catch(next);



}