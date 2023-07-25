const mongoose = require("mongoose"); 
const Rating = require("./ratings"); 

const bookSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userId:{type:String, required:true},
  title:{type:String, required:true},
  author:{type:String, required:true},
  year:{type:Number, required:true},
  genre:{type:String, required:false},
  ratings:[Rating.schema],
  averageRating:Number, 
  imageUrl: String
})

bookSchema.pre('save', function(next) {
  const sum = this.ratings.reduce((acc, rating) => acc + rating.grade, 0);
  this.averageRating =  Math.floor(sum / this.ratings.length); 
  next();
});

module.exports = mongoose.model("Book", bookSchema); 