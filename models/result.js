var mongoose = require("mongoose");

var resultSchema = new mongoose.Schema({
    wpm:String,
    date:String
});

module.exports = mongoose.model("Result",resultSchema);