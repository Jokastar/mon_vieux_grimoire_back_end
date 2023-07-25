const Book = require("../model/book"); 

exports.bookAuth = async (req, res, next)=> {

    try{
        const selectedBook = await Book.findOne({_id:req.params.id});
        if(!selectedBook) return res.status(400).json({message:"Book not found"});
        
        if(selectedBook.userId !== req.userId) return res.status(403).json({message:"Not Authorized"}); 

        next(); 

    }catch(e){
        res.status(500).json({error:e.message}); 
    }
    
  }