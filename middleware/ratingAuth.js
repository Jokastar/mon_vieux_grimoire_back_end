const Book = require("../model/book"); 

exports.ratingAuth = async (req, res, next) =>{
        try{
            const selectedBook = await Book.findOne({_id:req.params.id});
            if(!selectedBook) return res.status(400).json({message:"Book not found"})
            
            for(let rating of selectedBook.ratings){
                if(rating.userId === req.userId) return res.status(400).json({message:"user has already post a rating"})
            }

            next(); 
    
        }catch(e){
            res.status(500).json({error:e.message}); 
        }
}