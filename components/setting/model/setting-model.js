var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var setting = new Schema(
    {
       user:{type:mongoose.Schema.Types.ObjectId, ref:"User",default:null},
        servers:[
            {type:mongoose.Schema.Types.ObjectId, ref:"Server",default:null}
        ]
       

    }
);


module.exports = mongoose.model('Setting', setting);


