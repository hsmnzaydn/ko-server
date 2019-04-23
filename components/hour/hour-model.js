var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var hour = new Schema(
    {

        eventHour:{type: String},    // "12:00"
        isSelected:{type: Boolean, default: false} 
    }
);


module.exports = mongoose.model('Hour', hour);

