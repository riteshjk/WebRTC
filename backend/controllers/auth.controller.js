const otpservices = require('../services/otp.service')
const hashservice = require('../services/hash.service');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');
const UserDto = require('../dtos/user-dio');
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
            // await otpservices.sendBySms(phone,otp)
            return res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp
            })
        }
        catch(err){
            console.log(err)
            res.status(500).json("could not send otp")
        }

        res.json({hash})
    }

    async verifyOtp(req,res) {
        // Steps to verify otp
        // 1.get the data from body
        // 2.now in send otp we hashedotp now again with this data we have to hash it again
        // 3.after hashing we will get one output so we are going to compair this has with previous hash which we will get in sendsms
        // 4.If both the hash same we can successfully verify the otp
        // 5. In verification phase we will generate token which is required for authentication
        // 6. so here we are not going to store the otp on databse will directly store it on clinet side
        const {otp, phone, hash} = req.body;

        if(!otp || !phone || !hash){
            return res.status(400).json("all fields are required")
        }

        const [hashedOtp, expires] = hash.split(".")

        if(Date.now() > +expires){
            return res.status(400).json("otp expired")
        }

        const data = `${phone}.${otp}.${expires}`

        const isValid = otpservices.verifyOtp(hashedOtp,data)
        if(!isValid){
            return res.status(400).json("invalid otp")
        }
       
        let user;

        try{
            user = await userService.findUser({phone})
            if(!user){
            user = await userService.createUser({phone})
            }
        }
        catch(err){
            console.log(err)
            res.status(500).json("could not verify otp")
        }
        

       //token
        const {accessToken, refreshToken} = tokenService.generateTokens({_id:user._id, activated: false});

        await tokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        // we are storing both the tokens in cookies for security purpose and for frontend e are passing the flag which is auth true
        // to understabd user is authenticated or not
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });

      
    }

    async refresh(req, res) {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        // Check if token is in db
        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );
            if (!token) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        // check if valid user
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' });
        }
        // Generate new tokens
        const { refreshToken, accessToken } = tokenService.generateTokens({
            _id: userData._id,
        });

        // Update refresh token
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        // response
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }

    async logout(req,res){
        try{
            const {refreshToken} = req.cookies;
             // delete refresh token from db
            await tokenService.removeToken(refreshToken);

             // delete cookies
             res.clearCookie('refreshToken');
             res.clearCookie('accessToken');
             res.json({ user: null, auth: false });

        }
        catch(err){
            console.log(err)
        }
    }
    
}

module.exports = new AuthController()