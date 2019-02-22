const EXPRESS=require('express')
const CONTROLLER=require('../driver/controller/driver-controller')
const VALIDATION=require('../driver/validator/driver-validator')

const ROUTER=EXPRESS.Router();

ROUTER.get('/login',            VALIDATION.login,                CONTROLLER.driverProfileLogin )
ROUTER.post('/signUp',          VALIDATION.signUp,               CONTROLLER.driverSignUp    )
ROUTER.get('/viewBookings',     VALIDATION.validateBookings ,    CONTROLLER.verifyBookingDetails, CONTROLLER.showBooking)
ROUTER.post('/completeBooking', VALIDATION.validateComplete,     CONTROLLER.completeBooking)

module.exports =  ROUTER;