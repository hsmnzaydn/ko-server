var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var lottery = new Schema(
    {

        header:{type:String},
        description:{type: String},
        createdDate:{type : Number, default: Date.now()},
        endDate:{type:Number,default:null},
        winner:{type:String, default:""},
        participants:[{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null}]
    }
);


module.exports = mongoose.model('Lottery', lottery);

