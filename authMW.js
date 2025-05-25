const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";

function auth(req,res,next){
    const token = req.headers.token;
    const response = jwt.verify(token,JWT_SECRET)

    if(response){
        req.userId = response.id;
        next();
    }else{
        res.statusCode(403).json({
            message:"UnAuthorized"
        })
    }
}

module.exports = {
    auth,
    JWT_SECRET
}