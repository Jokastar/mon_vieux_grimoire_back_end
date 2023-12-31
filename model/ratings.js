const mongoose = require("mongoose"); 

const ratingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

  module.exports = mongoose.model("Rating", ratingSchema); 