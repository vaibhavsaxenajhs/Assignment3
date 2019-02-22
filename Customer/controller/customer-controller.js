const UTILS = require('../../Database/db_queries')
const HTTP_RESPONSE = require('../../utils/http-response')
const BCRYPT = require('bcrypt')
const TOKEN = require('../../utils/token')
const CONNECTION = require('../../Database/create-db-connection')
const DATE_TIME = require('dateformat')
const CONSTANTS = require('../../utils/constants')
const MONGO_CON = require('../../Database/mongo-db-con');

/*
*@function <b> insert user details </b><br>
*@param {string} email
*@param {string} first name
*@param {string} last name
*@param {string} password
*@param {string} mobile number
*@return {string} password true and false
*/
const customerSignUp = async (req, res) => {
    try {
        //checking wether duplicate email entry exist or not 
        let Data = await UTILS.EXECQUERY('SELECT user_email from CustomerDetails where user_email = ?', [req.body.email])
        if (Data.length > 0) {
            HTTP_RESPONSE.fail(res, "Email already exist", { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password }, {})
        }
        else {
            BCRYPT.hash(req.body.password, 10, function (error, hash) {
                // Store hash in database
                CONNECTION.connection.query("INSERT INTO CustomerDetails(first_name,last_name,user_email,mobile_number,password) VALUES(?,?,?,?,?)", [req.body.firstName, req.body.lastName, req.body.email, req.body.mobileNumber, hash], (error, result) => {
                    if (error) {
                        HTTP_RESPONSE.fail(res, error.message, { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password });
                    }
                    else {
                        HTTP_RESPONSE.success(res, "Successfully signed in", { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password });
                    }
                })
            })
        }

    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.details[0].message, {});
    }
}

/*
*@function <b> insert login details </b><br>
*@param {string} email
*@param {string} password
*@param {string} mobile number
*/
const customerProfileLogin = async (req, res) => {
    try {
        //fetching password via email
        let data = await UTILS.EXECQUERY('SELECT password,user_email FROM CustomerDetails where user_email=?', [req.query.email])
        //checking credentials
        const VERIFY = await BCRYPT.compare(req.query.password, data[0].password)

        if (!VERIFY) {
            HTTP_RESPONSE.fail(res, "Password not matched", { email: req.query.email, password: req.query.password }, {})
        }
        else {
            let tokensend = await TOKEN.generateToken({ email: req.query.email, password: req.query.password })
            res.json({
                status: true,
                message: "login successful",
                data: {
                    "token": tokensend,
                    "email": req.query.email
                }
            })
        }
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, {});
    }
}

/*
*@function <b> create booking </b><br>
*@param {string} pickup latitude
*@param {string} pickup longitude
*@param {string} drop latitude
*@param {string} drop longitude
*/
const insertBooking = async (req, res) => {
    try {
        let data = await TOKEN.verifyToken(req.body.token)

        let customerId = await UTILS.getID(data.email)
        //fetching current date and time
        let currentDate = DATE_TIME(new Date(), "yyyy/mm/dd")
        let currentTime = DATE_TIME(new Date(), "hh:MM:ss")

        let values = [currentDate, currentTime, req.body.pickupLat, req.body.pickupLong, req.body.dropLat, req.body.dropLong, customerId[0].customer_id, CONSTANTS.BOOKING_CREATED]

        let status = await UTILS.insertBookingDB(values)
        //insert mongoDB logs
        let mongodata = { booking_status: "BOOKING CREATED", current_date: currentDate, current_time: currentTime, pickup_lat: req.body.pickupLat, pickup_long: req.body.pickupLong, drop_lat: req.body.dropLat, drop_long: req.body.dropLong, customer_id: customerId[0].customer_id, booking_status: CONSTANTS.BOOKING_CREATED };
        MONGO_CON.dbo.collection("db_create_booking").insertOne(mongodata, function (err, result) {
            if (err) throw err;
        });
        HTTP_RESPONSE.success(res, "Ride booked", { booking_date: currentDate, booking_time: currentTime, pickup_location: { lat: req.body.pickupLat, long: req.body.pickupLong }, drop_location: { lat: req.body.dropLat, long: req.body.dropLong }, current_status: 1 });
    }
    catch (error) {
        if (error == false) {
            HTTP_RESPONSE.fail(res, "No record found", { pickupLat: req.body.pickupLat, pickupLong: req.body.pickupLong, dropLat: req.body.dropLat, dropLong: req.body.dropLong }, {});
        } else {
            HTTP_RESPONSE.fail(res, error.message, {}, {})
        }
    }
}

module.exports = {
    customerSignUp,
    customerProfileLogin,
    insertBooking
}
