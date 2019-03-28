var mongoose = require("mongoose");
var Mountain = require("./models/mountains");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Big Dangerous Peak", 
        image: "https://images.unsplash.com/photo-1547491659-390a7ac761f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        description: "Spicy jalapeno bacon ipsum dolor amet landjaeger spare ribs meatloaf chuck bacon, ribeye pastrami doner pork belly. Pork loin corned beef tongue sausage picanha short loin tail hamburger. Bacon ham pastrami t-bone doner, salami turducken flank bresaola beef ribs ribeye burgdoggen. Beef ribs meatball filet mignon, pig salami doner pork chop. Short ribs hamburger turkey burgdoggen spare ribs jowl cow kielbasa biltong short loin. Jowl prosciutto ham hock venison shoulder, doner tongue brisket burgdoggen jerky boudin turducken."
    },
    {
        name: "Snowy Terrain", 
        image: "https://images.unsplash.com/photo-1465220183275-1faa863377e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
        description: "Alcatra swine pastrami tongue fatback chicken pork belly jerky. Cupim fatback landjaeger filet mignon jerky rump sausage swine. Jerky buffalo pork belly, pork chop flank chicken picanha landjaeger ball tip. Pork belly bresaola pig, jerky tail pork loin shankle corned beef pork sausage ground round bacon porchetta andouille. Short loin meatloaf picanha tri-tip, pork belly fatback biltong sausage buffalo prosciutto salami boudin pig shankle ball tip. Brisket filet mignon tongue buffalo tenderloin bacon leberkas cow pig ball tip tail kielbasa ham pastrami. T-bone pastrami ball tip tail andouille."
    },
    {
        name: "Pretty Landscape", 
        image: "https://images.unsplash.com/photo-1547559277-a04dcf465047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "Picanha sausage corned beef bresaola, short loin kielbasa leberkas beef. Buffalo frankfurter turkey ham hock. Filet mignon turducken tenderloin burgdoggen, strip steak jowl hamburger bacon swine frankfurter meatloaf pancetta ham. T-bone leberkas buffalo jowl shoulder, salami brisket meatloaf."
    }
]
 
function seedDB(){
    //Remove all mountains
    Mountain.remove({}, function(err){
         if(err){
             console.log(err);
         }
         console.log("removed mountains!");
         Comment.remove({}, function(err) {
             if(err){
                 console.log(err);
             }
             console.log("removed comments!");
            //   add a few mountains
             data.forEach(function(seed){
                 Mountain.create(seed, function(err, mountain){
                     if(err){
                         console.log(err)
                     } else {
                         console.log("added a mountain");
                         //create a comment
                         Comment.create(
                             {
                                 text: "Mountains are beautiful, but I wish there was internet",
                                 author: "Argirowski"
                             }, function(err, comment){
                                 if(err){
                                     console.log(err);
                                 } else {
                                    //  add username and ID to comment and then save comment
                                    console.log("New Comment From " + req.user.username);
                                     mountain.comments.push(comment);
                                     mountain.save();
                                     console.log("Created new comment");
                                 }
                             });
                     }
                 });
             });
         });
     }); 
    //  //add a few comments
 }
 
module.exports = seedDB;