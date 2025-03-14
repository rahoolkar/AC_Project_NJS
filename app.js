const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const myError = require("./utils/myError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const session = require('express-session')
const cookieParser = require('cookie-parser'); 
var flash = require('connect-flash');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/project');
}

main().then(()=>{
    console.log("connected to the database");
    app.listen(3000,()=>{
        console.log("app is running on port 3000");
    })  
}).catch((error)=>{
    console.log(error);
});

app.use(express.static(Path.join(__dirname,"/public")))
app.engine('ejs', engine);
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"/views"));

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}
app.use(session(sessionOptions));
app.use(cookieParser()); 
app.use(flash());

app.use((req,res,next)=>{
    res.locals.flashMsg = req.flash("success");
    next();
})

app.use("/listings/:id/reviews",reviewRouter);
app.use("/listings",listingRouter);

app.all("*",(req,res)=>{
    throw new myError(404,"Page not found");
})

//Custom Error Handler
app.use((err,req,res,next)=>{
    let {status=500 ,message="Out tester are working"} = err;
    res.status(status).render("error.ejs",{message});
});

