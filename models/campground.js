var mongoose    = require("mongoose");

//Schema Setup
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String,
//     //to associate 2 different database campgrounds and comments
//     //an array of Id will the added to comments
//     comments: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Comment"
//         }    
//     ]
// });

// module.exports = mongoose.model("Campground", campgroundSchema);

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);