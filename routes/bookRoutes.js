const express = require("express"); 
const router = express.Router(); 
const bookCtrl = require("../controller/book"); 
const {bookAuth} = require("../middleware/BookAuth"); 
const { isAuth } = require("../middleware/jwt");
const imgCompression = require("../middleware/imageCompression"); 
const {ratingAuth} = require("../middleware/ratingAuth"); 
const multer = require("../middleware/multer-config"); 

//books routes
router.get("/", bookCtrl.getAllBooks);

router.post("/", isAuth, multer, imgCompression, bookCtrl.createBook); 

router.get("/bestrating", bookCtrl.bestRating); 

router.get("/:id", bookCtrl.getBook);

router.put("/:id", isAuth, bookAuth, multer, imgCompression, bookCtrl.updateBook);

router.delete("/:id", isAuth, bookAuth, bookCtrl.deleteBook); 

router.post("/:id/rating", isAuth, ratingAuth, bookCtrl.createRating); 

module.exports = router; 

