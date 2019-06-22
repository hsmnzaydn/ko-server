var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var setting = new Schema(
    {
       isOpenAutoConfirm:{type:Boolean,default:false}

    }
);


module.exports = mongoose.model('ServerSetting', setting);


