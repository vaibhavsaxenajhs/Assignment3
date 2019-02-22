const EXPRESS=require('express')
const CONTROLLER=require('../Admin/controller/adminController')
const VALIDATION=require('../Admin/validator/admin-validator')

const ROUTER=EXPRESS.Router();

ROUTER.get('/login',            VALIDATION.login,             CONTROLLER.adminProfileLogin )
ROUTER.get('/viewBookings',     VALIDATION.validateBookings , CONTROLLER.verifyBookingDetails, CONTROLLER.showBooking)
ROUTER.get('/drivers',          VALIDATION.validateData,      CONTROLLER.verifyDetails,        CONTROLLER.viewDrivers)
ROUTER.post('/assignDriver',    VALIDATION.validationData,    CONTROLLER.verifydriverDetails,        CONTROLLER.assignDriver)

module.exports =  ROUTER;
