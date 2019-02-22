const CONNECTION = require('../../Database/create-db-connection')
const CONSTANTS = require('../../utils/constants')

/*
*@function <b> gethashPassword </b><br>
*@param {string} email
*@return {string} password true and false
*/
const getHashPassword=(email)=>{
    return new Promise((resolve,reject)=>{
        CONNECTION.connection.query('select password from adminDetails where admin_email = ?',[email],(error,result)=>{
            if (result.length>0) {
                resolve(result) 
            } else {
                reject(error)               
            }
        })
    })
}

/*
*@function <b> getbookingdetails </b><br>
*@return {string} all booking entries
*/
const getBookingDetails=()=>{
    return new Promise((resolve,reject)=>{
        CONNECTION.connection.query('select * from tb_booking ',(error,result)=>{
            if (result.length>0) {
                resolve(result) 
            } else {
                reject("No bookings found")               
            }
        })
    })
}

/*
*@function <b> get driver details </b><br>
*@param {string} status
*@return {string} all  drivers 
*/
const getDriverDetails =(status)=>{
    return new Promise((resolve,reject)=>{
        CONNECTION.connection.query('select * from tb_driver where driver_status=?',[status],(error,result)=>{
            if (result.length>0) {
                resolve(result) 
            } else {
                reject("No Details found for this")  
            }
            if(error)
                reject(error)
            else{
                if(result.length>0)
                    resolve(result)
                else
                    resolve(false)
            }
        })
    })
}

/*
*@function <b> get driver status </b><br>
*@param {string} id
*@return {string} driver status
*/
const getDriverStatus =(id)=>{
    return new Promise((resolve,reject)=>{
        CONNECTION.connection.query('select driver_status from tb_driver where driver_id=?',[id],(error,result)=>{
            if(error)
                reject(error)
            else{
                if(result.length>0)
                    resolve(result)
                else
                    resolve(false)
            }
        })
    })
}

/*
*@function <b> assign driver job </b><br>
*@param {string} bookingId
*@param {string} driverId
*/
const assignDriverToJob =(bookingId,driverId)=>{
    return new Promise((resolve,reject)=>{
        CONNECTION.connection.query('update tb_booking set driver_id=?,booking_status=? where booking_id=?',[driverId,CONSTANTS.BOOKING_ONGOING,bookingId],(error,result)=>{
            if(error)
                reject(error)
            else{
                if(result)
                        resolve(result)
                else
                    resolve(false)
            }
        })
    })
}

/*
*@function <b> update driver status </b><br>
*@param {string} driverId
*@return update driver status
*/
const updateDriverStatus=(driverId)=>{
    return new Promise((resolve,reject)=>{
        CONNECTION.connection.query('update tb_driver set driver_status=? where driver_id=?',[CONSTANTS.DRIVER_ASSIGNED,driverId],(error,result)=>{
            if(error)
                reject(error)
            else{
                if(result)
                    resolve(result)
                else
                    resolve(false)
            }
        })
    })

}

module.exports={
    getHashPassword,
    getBookingDetails,
    getDriverDetails,
    getDriverStatus,
    assignDriverToJob,
    updateDriverStatus
}
