var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var conversation = new Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null},
        messages:[
            {type:mongoose.Schema.Types.ObjectId, ref:"Message",default:null}
        ]

    }
);


module.exports = mongoose.model('Conversation', conversation);

