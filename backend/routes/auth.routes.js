const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller')
const activeController = require('../controllers/activate.controller')
const authmiddleware  = require('../middleware/auth.middleware')
const roomsController = require('../controllers/rooms.controller')


router.post("/send-otp", authController.sendOtp)
router.post("/verify-otp", authController.verifyOtp)
router.post("/activate",authmiddleware, activeController.activate)
router.get('/refresh', authController.refresh);
router.post("/logout", authmiddleware, authController.logout);
router.post("/create-room", authmiddleware, roomsController.create);
router.get("/get-data", authmiddleware, roomsController.index)
router.get("/get-room/:roomId", authmiddleware, roomsController.show)


module.exports = router