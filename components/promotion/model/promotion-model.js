var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var promotion = new Schema(
    {
        name:{type:String},
        description:{type:String},
        coin:{type:mongoose.Schema.Types.ObjectId, ref:"Coin",default:null},
        price:{type:String}
       
        

    }
);


module.exports = mongoose.model('Promotion', promotion);

