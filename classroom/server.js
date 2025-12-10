const express = require('express');
const app = express();
const expressSession = require('express-session');
app.use(expressSession({secret:"mysupersecretstring"}));



app.get("/",(req,res)=>{
   res.send("test succesful ");
})



app.listen(3000,()=>{
   console.log("Server is listening at port 3000");

});