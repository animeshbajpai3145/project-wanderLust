const express = require('express');
const app = express();
const session = require('express-session');
const sessionOption = {secret:"mysupersecretstring",resave:false,saveUninitialized:true};
const flash = require("connect-flash");

app.use(session(sessionOption));
app.use(flash());
app.use((req,res,next)=>{
   res.locals.successMsg  =  req.flash("success");
   res.locals.errorMsg  =  req.flash("error");
   next();
});
const path = require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.get("/register",(req,res)=>{
   let{ name = "anonymous"}= req.query;
   req.session.name = name;
  
  
   if(name==="anonymous"){
 req.flash("error","user not registered");  
 }else{
      req.flash("success","User reqistered successfully");
   }
   res.redirect("/hello");
  


});
app.get("/hello",(req,res)=>{
 

res.render("page.ejs",{name:req.session.name});

});



// app.get("/",(req,res)=>{
//    res.send("test succesful ");
// })

// app.get("/reqCount",(req,res)=>{
//    if(req.session.count){
//       req.session.count++;
//    }else{
         
//    }
  

//  res.send(`You sent req ${req.session.count} times`);
// });


app.listen(3000,()=>{
   console.log("Server is listening at port 3000");

});