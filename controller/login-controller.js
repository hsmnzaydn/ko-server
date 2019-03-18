
const
      userSchema=require('../components/user/model/user_model')
      Constant=require('../Utils/Utility')
      installedApplicationSchema=require('../components/user/model/installed_application_model');

module.exports={
    login
}

async function login(req,res,next) {
    var phoneNumber=req.body.phoneNumber;
        password=req.body.password;

        userSchema.findOne({phoneNumber:phoneNumber,password:password}).
        populate({
            path:'installedApplication'
        }).
        then(user=>{
            if(user){
                installedApplicationSchema.findOne({_id:user.installedApplication._id}).then(installedApplication=>{installedApplication.udid=req.headers['udid']
                installedApplication.save()});


                res.status(200).send({
                    code:200,
                    message:"OK",
                    authorizationKey:user.installedApplication._id
                })
            }else{
                res.status(global.UNREGISTER_CODE).send({
                    code:global.UNREGISTER_CODE,
                    message:global.UNREGISTER_MESSAGE
                })
            }
        }).catch(next)

}