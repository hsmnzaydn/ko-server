var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var server = new Schema(
    {
       
        name:{type:String},
        entries:[
            {type:mongoose.Schema.Types.ObjectId, ref:"Entry",default:null}
        ]
       

    }
);


module.exports = mongoose.model('Server', server);

