var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var intermediaris = new Schema(
    {

        name:{type:String},
        phoneNumber:{type: String}

    }
);


module.exports = mongoose.model('Intermediaris', intermediaris);

