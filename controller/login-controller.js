
const
      userSchema=require('../components/user/model/user_model')
      Constant=require('../Utils/Utility')

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