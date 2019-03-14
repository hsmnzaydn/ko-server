var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var setting = new Schema(
    {
       
        servers:[
            {type:mongoose.Schema.Types.ObjectId, ref:"Server",default:null}
        ]
       

    }
);


module.exports = mongoose.model('Setting', setting);


