var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var message = new Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null},
        message:{type:String}

    }
);


module.exports = mongoose.model('Message', message);

