var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var report = new Schema(
    {
       
        header:{type:String},
        message:{type:String},
        user:{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null},
        entry:{type:mongoose.Schema.Types.ObjectId, ref:"Entry",default:null}

    }
);


module.exports = mongoose.model('Report', report);

