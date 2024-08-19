const UserModel = require('../models/user.model')
class userService{
    async findUser(filter){
        const user = await UserModel.findOne(filter)
        return user
    }

    async createUser(data){
        const user = await UserModel.create(data)
    }
    
}

module.exports = new userService()