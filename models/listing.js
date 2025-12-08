const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const  listingSchema = new Schema({
   title: {
      type:String,
      required:true,
   },
      description:String,
      image: {
         filename:{
            type:String,
            default:'listingimage'
         },
         url:{
            type:String,
            default:'https://images.unsplash.com/photo-1755417146741-8aafab9ec528?q=80&w=1860&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
         }

      ,
      price:Number,
      location:String, 
      country:String,
      reviews:[
         {type:Schema.Types.ObjectId,
            ref:"Review",

         },
      ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
  await Review.deleteMany({_id :{$in :listing.reviews}});
   }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;