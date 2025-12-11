const express = require('express');
const app = express();

app.listen(2929, (req,res)=>{
   console.log(
      "server started"
   );
});