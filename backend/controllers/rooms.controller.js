const RoomDto= require('../dtos/room.dto.js');
const roomService = require('../services/room.service')

class RoomController{

    async create(req,res){
        try{
            const {topic, roomType} = req.body;
            if (!topic || !roomType) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required!' });
            }

            const room = await roomService.create({topic,roomType,ownerId:req.user._id});
            return res.json(new RoomDto(room));
        }
        catch(err){
            console.log(err)
        }
    }

    async index(req,res){
        try{
            const rooms = await roomService.getAllRooms(['open']);
            const allRooms = rooms.map(room => new RoomDto(room));
            return res.json(allRooms);
        }
        catch(err){
            console.log(err)
        }
    }

    async show(req,res){
        try{
            const room = await roomService.getRoomById(req.params.roomId);
            return res.json(room)
        }
        catch(err){
            console.log(err)
        }
    }
}

module.exports = new RoomController()