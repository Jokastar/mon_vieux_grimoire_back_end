const express =require("express"); 
const router = express.Router();
const authCtrl = require("../controller/authentification"); 

router.post("/login", authCtrl.login); 
router.post("/signup", authCtrl.signup); 

module.exports = router; 
