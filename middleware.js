module.exports.isLoggedIn = (req,res,next)=>{
   if(!req.isAuthenticated()){
  req.flash("error","You must be logged in to create new  listing!");
   return res.redirect("/login");
  }
  next();
}
// this middleware is used to check that whether the user is logged in or not , if not that req.isAuthenticated reutrn false in passport  method