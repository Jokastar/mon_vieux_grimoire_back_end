const User = require("../model/user"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const { generateAccessToken } = require("../middleware/jwt");

module.exports.login = async (req, res) => {
  
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: "Incorect email or password" });
      }
  
      const valid = await bcrypt.compare(req.body.password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Incorect email or password" });
      }
      const token = await generateAccessToken(user._id); 
      return res.status(200).json({userId:user._id, token:token}); 
    } catch (e) {
      return res.status(500).json({ error: e.message });
    } 
  };


  module.exports.signup = async (req, res) => {
     
    try {
      let user = await User.findOne({email:req.body.email}); 
  
      if(user != null) return res.status(409).json({message:'User already exists'});

      const hash = await bcrypt.hash(req.body.password, 10);
       user = new User({
        email: req.body.email,
        password: hash
      });
  
      await user.save();
      res.status(201).json({ message: "user created"});
    } catch (e) {
      res.status(500).json({ error: e.message});
    }
  };

 