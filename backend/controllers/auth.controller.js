const otpservices = require('../services/otp.service')
const hashservice = require('../services/hash.service')
class AuthController{
    sendOtp =async(req,res) =>{
        // logic
        // 1. generate otp
        // 2. hash otp
        
        const {phone} = req.body;
        
        if(!phone){
            return res.status(400).json("phone is required")
        }

        const otp =await otpservices.generateotp()
        const ttl = 1000 * 60 * 2   //2 minutes
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;

        // after generating otp we are not going to store it in database it is not safe so we will hash that content but wont hash only otp
        // will pass otp, expiration time and phone number to sendOtp 

        const hash = hashservice.hashOtp(data)
        try{
            await otpservices.sendBySms(phone,otp)
            return res.json({
                hash: `${hash}.${expires}`,
                phone
            })
        }
        catch(err){
            console.log(err)
            res.status(500).json("could not send otp")
        }

        

        
        res.json({hash})
    }
}

module.exports = new AuthController()