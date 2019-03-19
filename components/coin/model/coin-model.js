var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var coin = new Schema(
    {
        value:{type:Number,default:40}
    }
);


module.exports = mongoose.model('Coin', coin);

