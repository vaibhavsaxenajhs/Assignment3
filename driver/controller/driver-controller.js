const UTILS = require('../../Database/db_queries')
const HTTP_RESPONSE = require('../../utils/http-response')
const BCRYPT = require('bcrypt')
const TOKEN = require('../../utils/token')
const CONNECTION = require('../../Database/create-db-connection')
const DRIVER_QUERIES = require('../../driver/services/db_queries')
const CONSTANTS = require('../../utils/constants')
const MONGO_CON = require('../../Database/mongo-db-con');
const Promise = require('bluebird')

/*
*@function <b> insert driver details </b><br>
*@param {string} email
*@param {string} first name
*@param {string} last name
*@param {string} password
*@param {string} mobile number
*@return {string} password true and false
*/
const driverSignUp = Promise.coroutine(function* (req, res) {
    try {
        let Data = yield UTILS.EXECQUERY('SELECT email from tb_driver where email = ?', [req.body.email])
        if (Data.length > 0) {
            HTTP_RESPONSE.fail(res, "Email already exist", { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password, licenceNumber: req.body.licenceNumber }, {})
        }
        else {
            BCRYPT.hash(req.body.password, 10, function (error, hash) {
                // Store hash in database
                CONNECTION.connection.query("INSERT INTO tb_driver(f_name,l_name,email,mobile_number,password,licence_number,driver_status) VALUES(?,?,?,?,?,?,?)", [req.body.firstName, req.body.lastName, req.body.email, req.body.mobileNumber, hash, req.body.licenceNumber, CONSTANTS.DRIVER_IDLE], (error, result) => {
                    if (error) {
                        HTTP_RESPONSE.fail(res, error.message, {});
                    } else {
                        HTTP_RESPONSE.success(res, "Successfully signed in", { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password, licenceNumber: req.body.licenceNumber });
                    }
                })
            })
        }
    } catch (error) {
        HTTP_RESPONSE.fail(res, error.details[0].message, {});
    }
})

/*
*@function <b> insert admin details </b><br>
*@param {string} email
*@param {string} password
*@return {string} token true and false
*/
const driverProfileLogin = (req, res) => {
    Promise.coroutine(function* () {
        let data = yield UTILS.EXECQUERY('SELECT password,email FROM tb_driver where email=?', [req.query.email])
        const VERIFY = yield BCRYPT.compare(req.query.password, data[0].password)
        if (!VERIFY) {
            HTTP_RESPONSE.fail(res, "Password not matched", { email: req.query.email, password: req.query.password }, {})
        } else {
            let tokensend = yield TOKEN.generateToken({ email: req.query.email, password: req.query.password })
            res.json({
                status: true,
                message: "login successful",
                data: {
                    "token": tokensend,
                    "email": req.query.email
                }
            })
        }
    })().catch((error) => {
        HTTP_RESPONSE.fail(res, error.message, { email: req.query.email, password: req.query.password }, {});
    })
}

/*
*@function <b> verify booking details </b><br>
*@param {string} email
*@param {string} password
*@return {string} token
*/
const verifyBookingDetails = Promise.coroutine(function* (req, res, next) {
    try {
        let data = yield TOKEN.verifyToken(req.query.token)
        //fetching hashPassword stored in database
        let hashPassword = yield DRIVER_QUERIES.getHashPassword(data.email)
        //comparing hashpassword
        let status = yield BCRYPT.compare(data.password, hashPassword[0].password)
        if (status)
            next()
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { token: req.query.token, status: req.query.status }, {})
    }
})

/*
*@function <b> show booking details </b><br>
*@param {string} email
*@param {string} password
*@return {string} token
*/
const showBooking = (req, res) => {
    Promise.coroutine(function* () {
        let data = yield TOKEN.verifyToken(req.query.token)
        //fetching hashpassword from database 
        let hashPassword = yield DRIVER_QUERIES.getHashPassword(data.email)
        //comparing hashpassword
        let status = yield BCRYPT.compare(data.password, hashPassword[0].password)
        //fetching driverID
        let driverId = yield DRIVER_QUERIES.getDriverId(data.email)
        let bookingDetails = yield DRIVER_QUERIES.getBookingDetails(driverId[0].driver_id, req.query.status)
        if (bookingDetails.length > 0)
            HTTP_RESPONSE.success(res, "Data Fetch successfully", bookingDetails)
    })().catch((error) => {
        HTTP_RESPONSE.fail(res, error.message, { token: req.query.token, status: req.query.status }, {});
    })
}

/*
*@function <b> complete booking  </b><br>
*@param {string} email
*@param {string} password
*@param {string} bookingid
*@return {string} token
*/
const completeBooking = (req, res, next) => {
    Promise.coroutine(function* () {
        //verify token of driver
        let data = yield TOKEN.verifyToken(req.body.token)
        //fetching hashpassword from database
        let hashPassword = yield DRIVER_QUERIES.getHashPassword(data.email)
        //fetching driverID
        let status = yield BCRYPT.compare(data.password, hashPassword[0].password)
        let driver_id = yield DRIVER_QUERIES.getDriverId(data.email)
        if (status)
            status = yield DRIVER_QUERIES.completeBooking(req.body.bookingId)
        if (status) {
            status = yield DRIVER_QUERIES.completeBooking(req.body.bookingId)
            //insert mongoDB logs
            let mongodata = { booking_status: "BOOKING COMPLETED", email: data.email, driverId: driver_id };
            MONGO_CON.dbo.collection("db_create_booking").insertOne(mongodata, function (err, result) {
                if (err) throw err;
            });
            HTTP_RESPONSE.success(res, "Job completed successfully", { token: req.body.token, bookingId: req.body.bookingId })
        }
    })().catch((error) => {
        HTTP_RESPONSE.fail(res, error.message, { token: req.body.token, bookingId: req.body.bookingId }, {})
    })
}


module.exports = {
    driverSignUp,
    driverProfileLogin,
    verifyBookingDetails,
    showBooking,
    completeBooking
}
