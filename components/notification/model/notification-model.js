var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var notification = new Schema(
    {
        title:{type:String},
        message:{type:String}
    }
);


module.exports = mongoose.model('Notification', notification);

