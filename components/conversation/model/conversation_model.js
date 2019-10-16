var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var conversation = new Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null},
        ownerId:{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null}, // Entry sahibi 
        entry:{type:mongoose.Schema.Types.ObjectId, ref:"Entry",default:null}

    }
);


module.exports = mongoose.model('Conversation', conversation);

