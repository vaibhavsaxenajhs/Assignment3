const UTILS = require('../../Database/db_queries')
const HTTP_RESPONSE = require('../../utils/http-response')
const BCRYPT =require('bcrypt')
const TOKEN = require('../../utils/token')
const ADMIN_QUERIES = require('../../Admin/services/db_queries')
const CONSTANTS = require('../../utils/constants')
const Promise = require('bluebird')

/*
*@function <b> login </b><br>
*login for email
*@param {string} email and password
*@return {string} true and false
*/
adminProfileLogin=Promise.coroutine(function*(req, res) {
    try {
        let data = yield UTILS.EXECQUERY('SELECT password,admin_email FROM adminDetails where admin_email=?',[req.query.email])
        const VERIFY = yield BCRYPT.compare(req.query.password,data[0].password)
        if (VERIFY) 
        {    let tokensend = yield TOKEN.generateToken({ email: req.query.email, password: req.query.password })
            res.json({
                status:true,
                message: "login successful",
                data:{"token": tokensend,
                "email": req.query.email
            }
            })
        }
        else{
            HTTP_RESPONSE.fail(res,"Password not matched ",{email:req.query.email,password:req.query.password},{});
        }
    }
    catch (error) {
        console.log(error)
        HTTP_RESPONSE.fail(res,error.message,{});
            }
    })

/*
*@function <b> verify booking details  </b><br>
*@param {string} token 
*@return {string} true and false
*/
const verifyBookingDetails = Promise.coroutine(function*(req,res,next){
    try {
        let email= yield TOKEN.verifyToken(req.query.token)   
        let hashPassword = yield ADMIN_QUERIES.getHashPassword(email.email)    
        let status = yield BCRYPT.compare(email.password,hashPassword[0].password)   
        if(status)
            next()
    } 
    catch (error) {
        HTTP_RESPONSE.fail(res,error,{token:req.query.token,status:req.query.status},{})
    }
} )

/*
*@function <b> show all bookings </b><br>
*@param {string} token of admin
*@return {string} true and false
*/
const showBooking = Promise.coroutine(function*(req,res){
    try {
        let email = yield TOKEN.verifyToken(req.query.token)
        let hashPassword = yield ADMIN_QUERIES.getHashPassword(email.email)
        let status = yield BCRYPT.compare(email.password,hashPassword[0].password)
        let bookingDetails =yield ADMIN_QUERIES.getBookingDetails()
            
        if(bookingDetails.length>0)
            HTTP_RESPONSE.success(res,"Data Fetch successfully",bookingDetails)
    } 
    catch (error) {
         HTTP_RESPONSE.fail(res,error,{token:req.query.token,status:req.query.status},{});
}})

/*
*@function <b> verify booking details  </b><br>
*@param {string} token 
*@return {string} true and false
*/
const verifyDetails = Promise.coroutine(function*(req,res,next){
    try {
    
        let data = yield TOKEN.verifyToken(req.query.token)
        let hashPassword = yield ADMIN_QUERIES.getHashPassword(data.email)
        let status = yield BCRYPT.compare(data.password,hashPassword[0].password)
        
        if(status)
            next()
    }
    catch (error) {
         HTTP_RESPONSE.fail(res,error,{token:req.query.token,status:req.query.status},{});
}
})

const verifydriverDetails = Promise.coroutine(function*(req,res,next){
    try {
        let data = yield TOKEN.verifyToken(req.body.token)
        let hashPassword = yield ADMIN_QUERIES.getHashPassword(data.email)
        let status = yield BCRYPT.compare(data.password,hashPassword[0].password)
        if(status)
            next()
    }
    catch (error) {
         HTTP_RESPONSE.fail(res,error,{token:req.body.token,status:req.body.status},{});
}
})

/*
*@function <b> viewdrivers </b><br>
*@param {string} token
*@param {number} driverstatus
*@return {string} true and false
*/
const viewDrivers = Promise.coroutine(function*(req,res){
    try {
        let data =yield ADMIN_QUERIES.getDriverDetails(req.query.status)
        if(data==false)
            HTTP_RESPONSE.fail(res,error,{token:req.query.token,status:req.query.status},{})
        else
        HTTP_RESPONSE.success(res,"Data fetch success",data) 
    } 
    catch (error) {
        HTTP_RESPONSE.fail(res,error,{token:req.query.token,status:req.query.status},{})
    }
})

/*
*@function <b> viewbookings </b><br>
*@param {string} token
*@return {string} true and false
*/
const viewBookings= Promise.coroutine(function*(req,res){
    try {
        let data =yield ADMIN_QUERIES.getDriverDetails(req.body.status)
        if(data==false)
            HTTP_RESPONSE.fail(res,error,{token:req.body.token,status:req.body.status},{})
        else
            HTTP_RESPONSE.success(res,"Data fetch success",data)
    } 
    catch (error) {
        HTTP_RESPONSE.fail(res,error,{token:req.body.token,status:req.body.status},{})
    }
})

/*
*@function <b> viewdrivers </b><br>
*@param {string} token
*@param {string} driverid
*@param {string} bookingId
*@return {string} true and false
*/
const assignDriver=Promise.coroutine(function* (req,res){
    try{
        let status =yield ADMIN_QUERIES.getDriverStatus(req.body.driverId)
        if(status == false)
            HTTP_RESPONSE.fail(res,"No driver found for this id",{token:req.body.token,driverId:req.body.driverId,bookingId:req.body.bookingId},{})
        else{
            if(status[0].driver_status ==CONSTANTS.DRIVER_ASSIGNED){
                HTTP_RESPONSE.fail(res,"Driver already assigned",{token:req.body.token,driverId:req.body.driverId,bookingId:req.body.bookingId},{}) 
            }
            else{
                ADMIN_QUERIES.assignDriverToJob(req.body.bookingId,req.body.driverId)
                ADMIN_QUERIES.updateDriverStatus(req.body.driverId)
                HTTP_RESPONSE.fail(res,"Driver Assigned Success",{token:req.body.token,driverId:req.body.driverId,bookingId:req.body.bookingId},{})
            }
        }
    }
    catch(error){
        HTTP_RESPONSE.fail(res,error.message,{token:req.body.token,driverId:req.body.driverId,bookingId:req.body.bookingId},{})
    }       
})


module.exports={
    adminProfileLogin,
    verifyBookingDetails,
    showBooking,
    verifyDetails,
    viewDrivers,
    viewBookings,
    assignDriver,
    verifydriverDetails
}