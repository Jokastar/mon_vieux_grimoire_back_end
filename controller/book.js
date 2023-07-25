const Book = require("../model/book"); 
const Rating = require("../model/ratings"); 
const fs = require('fs');
const path =  require("path"); 

exports.getAllBooks = async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

exports.getBook = async (req, res) => {
  if(!req.params.id) return res.status(400).json({error:"no book id provided"}); 

    try {
      const book = await Book.findOne({ _id: req.params.id });
      res.status(200).json(book);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

 exports.createBook = async(req, res)=>{
    const book = JSON.parse(req.body.book);
    
    if(!book) return res.status(400).json({error:"no book provided"})
    
    try{ 
        const newBook = new Book({
            userId:req.userId, 
            title: book.title,
            author: book.author, 
            year: book.year,
            genre: book.genre,
            ratings: book.ratings,
            imageUrl:`${req.protocol}://${req.get('host')}/images/${req.imageUrl}`
        })
        await newBook.save(); 

        return res.status(201).json({message:"Book added"}); 

    }catch(e){
        res.status(500).json({error:e.message})
    } 
}

exports.updateBook = async (req, res) => {
  try {

    //remove the old image file from the images directory
    if (req.file) {
      const book = await Book.findById(req.params.id);
      if (book) {
        const imageUrl = book.imageUrl;
        const filename = imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
      }
    }

    // create the updated book
    const updatedBook = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.imageUrl}`,
        }
      : { ...req.body };

    delete updatedBook.userId;

    
//update the book
    await Book.updateOne(
      { _id: req.params.id },
      { ...updatedBook, _id: req.params.id, userId: req.userId }
    );

    res.status(200).json({ message: 'Book modified'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


  exports.deleteBook = async (req, res) => {

  if(!req.params.id) return res.status(400).json({error:"no book id provided"}); 
  try {
    const book = await Book.findOne({ _id: req.params.id });
    const filename = book.imageUrl.split('/images/')[1];

    fs.unlink(`images/${filename}`, async () => {
      try {
        await Book.deleteOne({ _id: req.params.id });
        res.status(204).json({ message: 'Book deleted'});
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

  exports.bestRating = async (req, res)=>{
   try{
        const bestRatingBooks = await Book.find().sort({ averageRating: -1 }).limit(3);

        if(!bestRatingBooks) return res.status(401).json({message:"Nonexistent Book"}); 
        
        return res.status(200).json(bestRatingBooks)
    }catch(e){
        return res.status(500).json({error:e.message}); 
    }  
  } 

  exports.createRating = async (req, res)=>{

    if(!req.params.id) return res.status(400).json({error:"no book id provided"}); 

    try{
        const book = await Book.findOne({_id:req.params.id}); 
        if(!book) return res.status(401).json({message:"book not found"}); 

        const rating = new Rating({userId: req.userId, grade:req.body.rating});
        await rating.save(); 
        book.ratings.push(rating); 
        await book.save(); 
        
        return res.status(201).json(book); 
        
    }catch(e){
        return res.status(500).json({error:e.message}); 
    }
    
  }

