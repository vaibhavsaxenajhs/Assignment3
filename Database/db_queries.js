const CONSTANTS = require('../utils/constants')
const CONNECTION = require('./create-db-connection')

/*
*@function <b> admin details in database </b><br>
*@return {string} password true and false
*/
const insertAdminInDb = (values) => {
    return new Promise((resolve, reject) => {
        //signUp query
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
        //for fetching data
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
*@function <b> insert driver details </b><br>
*@param {string} email
*@return {string} password true and false
*/
const getPassword = (email) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('select password from CustomerDetails where user_email=?', [email], (error, result) => {
            if (result.length > 0) {
                resolve(result)
            } else {
                reject(false)
            }
        })
    })
}

/*
*@function <b> insert driver details </b><br>
*@param {string} email
*@return {string} customer id
*/
const getID = (email) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('select customer_id from CustomerDetails where user_email=?', [email], (error, result) => {
            if (result.length > 0) {
                resolve(result)
            } else {
                reject(false)
            }
        })
    })
}

const insertBookingDB = (values) => {
    return new Promise((resolve, reject) => {
        CONNECTION.connection.query('insert into tb_booking(booking_date,booking_time,pickup_lat,pickup_long,drop_lat,drop_long,customer_id,booking_status) values(?,?,?,?,?,?,?,?)', values, (error, result) => {
            if (!error) {

                resolve(result)
            } else {
                reject(false)
            }
        })
    })
}

module.exports = {
    EXECQUERY,
    insertAdminInDb,
    getPassword,
    getID,
    insertBookingDB
}