const crypto = require('crypto')
const dotenv = require('dotenv').config();
class hashService{
   hashOtp(data){
    return crypto.createHash('sha256',process.env.HASH_SECRET).update(data).digest('hex')
   }
}

module.exports = new hashService()