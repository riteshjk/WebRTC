const crypto = require('crypto')
const hashService = require('./hash.service')

const smsSid = process.env.TWILIO_ACCOUNT_SID
const smsAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilio  = require('twilio')(smsSid,smsAuthToken,{
    lazyLoading: true
})
class otpService{
    async generateotp(){
        const otp =await crypto.randomInt(1000,9999)
        return otp
    }

    async sendBySms(phone, otp){
        return await twilio.messages.create({
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: `your otp is ${otp}`
        })
    }

    verifyOtp(hashedOtp, data){
        const isValidHash = hashService.hashOtp(data);

        if(hashedOtp == isValidHash ){
            return true
        }
        else{
            return false
        }
    }
}

module.exports = new otpService()