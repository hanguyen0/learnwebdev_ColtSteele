var express = require('express');
var router = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

//INDEX ROUTE- display all campgrounds
//retrieve all campgrounds from the database
router.get("/", function(req, res) {
   //get all campgrounds from dbs
   Campground.find({}, function(err, allCampgrounds) {
       if(err) {
           console.log(err);
       } else {
            //render the file
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
       }
   });
  
});


//CREATE ROUTE--add new campground to DB
//create a new campground
router.post("/", isLoggedIn,function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, image:image, description: desc, author: author};
    //Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log("req.user.username is " + req.user.username);
            console.log("req.user is " + req.user);
            console.log("author object is " + author);
            console.log("author.id is " + author.id);
            console.log("author.username is " + author.username);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
            console.log("You clicked the submit button");
            console.log(newlyCreated);
        }
    });
});


//NEW ROUTE- display form to create new campground
//show the form that will send data to POST route
router.get("/new", isLoggedIn,function(req, res) {
   res.render("campgrounds/new");
});


//SHOW ROUTE-show info about a certain campground with ID
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    //render SHOW PAGE with that campground
    //res.render("show");
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", function(req, res) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                console.log("foundCampground is " + foundCampground);
                console.log("foundCampground.author is " + foundCampground.author);
                console.log("req.user.id is " + req.user._id);
                //if yes ==> does user own campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    res.render("campgrounds/edit", {campground: foundCampground});
                } else {
                    res.send("You do not have permission to edit");
                }
            }
            
        });
        //if not ==> redirect
    } else {
        res.send("You need to login first");
    }
        
        
        //if not ==>redirect
    
    
    
});
//UPDATE CAMPGOUND ROUTE
router.put("/:id", function(req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //redirect to that campground show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});


//DESTROY CAMPGROUND
router.delete("/:id", function(req, res) {
    Campground.findOneAndDelete(req.params.id, function(err) {
       if(err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
});


module.exports = router;

// Campground.create(
//     {
//         name: "Acorn Oaks", 
//         image: "https://www.nps.gov/zion/planyourvisit/images/South_CG_r_1.jpg",
//         description: "This is a field full of acorn and oaks"
//     }, 
//     function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly created campground");
//             console.log(campground);
//         }
//     });


// var  campgrounds = [
//       {name: "Salmon Greek", img: "https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
//       {name: "Acorn Oaks", img: "https://www.nps.gov/zion/planyourvisit/images/South_CG_r_1.jpg"},
//       {name: "Blue Lake", img: "http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg"}
//         ];
        
        
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}