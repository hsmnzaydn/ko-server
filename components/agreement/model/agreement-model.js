var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var agreement = new Schema(
    {
       
        header:{type:String},
        message:{type:String}
       

    }
);


module.exports = mongoose.model('Agreement', agreement);


