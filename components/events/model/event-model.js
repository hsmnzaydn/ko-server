var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var event = new Schema(
    {

        eventName:{type:String},    // Chaos
        eventDays:[{type: String}], // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        eventHours:[{type:mongoose.Schema.Types.ObjectId, ref:"Hour",default:null}]  // [{eventHour:"09:00", isSelected:true}, ...]
    }
);


module.exports = mongoose.model('Event', event);

