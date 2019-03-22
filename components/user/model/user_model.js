var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var user = new Schema(
    {
        installedApplication:{type:mongoose.Schema.Types.ObjectId, ref:"InstalledApplication",default:null},
        name:{type:String,default:null},
        surname:{type:String,default:null},
        nickname:{type:String,default:null},
        password:{type:String},
        phoneNumber:{type:String},
        registerStatus:{type:String},
        registerServer:{type:mongoose.Schema.Types.ObjectId, ref:"Server",default:null},
        coin:{type:mongoose.Schema.Types.ObjectId, ref:"Coin",default:null},
        smsCode:{type:String},
        isShowPhoneNumber:{type:Boolean,default:false},
        entries:[
            {type:mongoose.Schema.Types.ObjectId, ref:"Entry",default:null}
        ],
        notifications:[
                {type:mongoose.Schema.Types.ObjectId, ref:"Notification",default:null}
        ],
         settings:   {type:mongoose.Schema.Types.ObjectId, ref:"Setting",default:null}


    }
);


module.exports = mongoose.model('User', user);

