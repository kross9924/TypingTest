var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    wordArr =[],
    // Test = require("./models/test"),
    // Result = require("./models/result"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");


// var request = require('request');
// request('https://random-word-api.herokuapp.com//word?key=U10IMZBF&number=500',function(error,response,body){
//     if(!error && response.statusCode===200){
//         var data = JSON.parse(body);
//         wordArr = data;
//     }
// });



//mongoose.connect("mongodb://localhost:27017/typingMaster",{useNewUrlParser:true});

mongoose.connect("mongodb+srv://kross:kross123@typingtest0-fgpiq.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.use(require("express-session")({
    secret:"hello there",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/taketest/:id",isLoggedIn,function(req,res){
    User.findById(req.user.id,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            var test = user.tests.id(req.params.id);
            res.render("typingtest",{test:test});
            }
        });
});

app.post("/result",isLoggedIn,function(req,res){
    User.findById(req.user.id,function(err,user){
        if(err){
            console.log(err);
        }else{
            var wpm = req.body.result;
            var date = new Date();
            var newResult = {wpm:wpm,date:date};
            user.results.push(newResult);
            user.save();
            res.redirect("/result");
        }
    });
});

app.get("/result",isLoggedIn,function(req,res){
    User.findById(req.user.id, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            var results = user.results;
            // res.set('Content-Type', 'application/javascript');
            res.render("result",{results:results});
        }
    });
});

app.get("/maketest",isLoggedIn,function(req,res){
    res.render("maketest");
});

app.post("/maketest",isLoggedIn,function(req,res){
    User.findById(req.user.id,function(err,user){
        if(err){
            console.log(err);
            res.render("/");
        }else{
            var name = req.body.name;
            var data = req.body.data;
            var newTest = {
                name:name,
                data:data
            }
            user.tests.push(newTest);
            user.save();
            res.redirect("/chooseTest");
        }
    });
    
});

app.get("/choosetest",isLoggedIn,function(req,res){
    User.findById(req.user.id,function(err,user){
        if(err){
            console.log(err);
            res.render("/");
        }else{
            var tests = user.tests;
            res.render("chooseTest",{tests:tests});
        }
    });
    
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
    }),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT||3000,process.env.IP,function(){
    console.log("server has started");
});