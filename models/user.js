var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var resultSchema = new mongoose.Schema({
    wpm:String,
    date:String
});

var testSchema = new mongoose.Schema({
    name:String,
    data:String
});


var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    tests:[testSchema],
    results:[resultSchema]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);