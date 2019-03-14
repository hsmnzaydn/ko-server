var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var entry = new Schema(
    {

        header: {type: String},
        message: {type: String},
        creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true,default: null},
        viewed: {type: Number, default: 0},
        server: {type: mongoose.Schema.Types.ObjectId, ref: "Server",required:true, default: null},
        status: {type: String, default: 'UNCONFIRMED'},
        price: {type: Number, default: 0},
        createdDate: {type: Number, default: Date.now()},
        isDisable: {type: Boolean, default: false},
        entryImageUrl: {type: String, default: null}

    }
);


module.exports = mongoose.model('Entry', entry);

