module.exports.isLoggedIn = (req,res,next)=>{ 

   if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
  req.flash("error","You must be logged in to create new  listing!");
   return res.redirect("/login");
  }
  next();
}
// this middleware is used to check that whether the user is logged in or not , if not that req.isAuthenticated reutrn false in passport  method


// middleware to implement the functionality to redirect to same url from where user got flash to login 
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl =  req.session.redirectUrl;
  }
  next();
}