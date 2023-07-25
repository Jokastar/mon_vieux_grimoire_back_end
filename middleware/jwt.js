const jwt = require("jsonwebtoken"); 


exports.isAuth = (req, res, next)=>{

    try{
        let token; 
        if(req.headers.authorization){
             token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
        return res.status(401).send("Not Authorized");
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
        
            if(err) return res.status(401).json({error: err.message}); 

            req.userId = user.userId;
            next(); 
        })
    }catch(e){
        return res.status(500).json({error:e.message}); 
    }
     
 
}

exports.generateAccessToken = async (userId)=>{
    const expirationTime = "2h"; 
    const token = await jwt.sign({userId:userId
    }, process.env.JWT_SECRET_KEY, { expiresIn: expirationTime });
    return token;  
}