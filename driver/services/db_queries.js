const CONNECTION = require('../../Database/create-db-connection')
const CONSTANTS = require('../../utils/constants')
const DATE_TIME = require('dateformat')

/*
*@function <b> insert admin details </b><br>
*@param {string} email
*@param {string} first name
*@param {string} last name
*@param {string} password
*@param {string} mobile number
*@return {string} password true and false
*/
const insertAdminInDb = (values) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('INSERT INTO adminDetails(admin_id,first_name,last_name,admin_email,password) VALUES ?', [values], (error, rows) => {
            if (error) {
                reject(error)
            } else {
                resolve(true)
            }
        })

    })
}

const EXECQUERY = (query, param = []) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query(query, param, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

/*
*@function <b> insert admin details </b><br>
*@param {string} email
*@return {string} password 
*/
const getHashPassword = (email) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('select password from tb_driver where email = ?', [email], (error, result) => {
            if (result.length > 0) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

/*
*@function <b> insert admin details </b><br>
*@param {string} id
*@param {string} status
*@return {string} bookingDetails
*/
const getBookingDetails = (id, status) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('select * from tb_booking where driver_id = ? and booking_status=? ', [id, status], (error, result) => {
            if (result.length > 0) {
                resolve(result)
            } else {
                reject("No bookings found")
            }
        })
    })
}

/*
*@function <b> insert admin details </b><br>
*@param {string} email
*@return {string} driver id
*/
const getDriverId = (email) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('select driver_id from tb_driver where email = ? ', [email], (error, result) => {
            if (result.length > 0) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })

}

/*
*@function <b> insert admin details </b><br>
*@param {string} booking id
*@param {string} driver id
*@return {string} password true and false
*/
const completeBooking = (bookingId, driverId) => {
    return new Promise((resolve, reject) => {
        let currentDate = DATE_TIME(new Date(), "yyyy/mm/dd")
        let currentTime = DATE_TIME(new Date(), "hh:MM:ss")
        CONNECTION.connection.query('update tb_booking set booking_status=?,completion_date=?,completion_time=?  where booking_id =? and driver_id=?', [CONSTANTS.BOOKING_COMPLETED, currentDate, currentTime, bookingId, driverId], (error) => {
            if (!error) {
                resolve(true)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    EXECQUERY,
    insertAdminInDb,
    getHashPassword,
    getBookingDetails,
    getDriverId,
    completeBooking
}