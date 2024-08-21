const tokenService = require("../services/token.service");

module.exports = async(req, res, next) => {
    try{
        const {accessToken} = req.cookies;
       if(!accessToken){
        throw new Error("Unauthenticated");
       }
       const userData = await tokenService.verifyAccessToken(accessToken);
       req.user = userData;
       next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid Token"});
    }
}