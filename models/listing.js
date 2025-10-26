const mongoose = require ("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");
// const { listingSchema } = require("../schema");

const listingSchema = new Schema({
    title:{
    type:String,
    require: true
    },

    description: String,
    image: {
      url: String,
      filename: String,
    },
    price: {
    type: Number,
    required : true,
    default: 0,
  },
    location: String,
    country: String,
    reviews:[ {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

  
});
  listingSchema.post("findOneAndDelete", async(listing)=> {
       if(listing) {
      await Review.deleteMany({_id: {$in: listing.reviews}});
       }
    });


const Listing =   mongoose.model("Listing", listingSchema);
module.exports = Listing;


