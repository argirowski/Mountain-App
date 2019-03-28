var mongoose = require("mongoose");

// Schema Set Up

var mountainSchema = new mongoose.Schema({
  name: String,
  price: String,
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

//   var Mountain = mongoose.model("Mountain", mountainSchema);

module.exports = mongoose.model("Mountain", mountainSchema);

//   module.exports = Mountain; can be like this also
