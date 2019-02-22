const EXPRESS=require('express')
const VALIDATORS=require('../Customer/validator/customer-validator')
const CONTROLLER=require ('../Customer/controller/customer-controller')

const ROUTER=EXPRESS.Router();

ROUTER.post('/signUp',          VALIDATORS.signUp ,         CONTROLLER.customerSignUp )
ROUTER.get('/login',            VALIDATORS.login,           CONTROLLER.customerProfileLogin )
ROUTER.post('/createBooking',   VALIDATORS.validateBooking ,VALIDATORS.tokenVerification,       CONTROLLER.insertBooking)

module.exports =  ROUTER
