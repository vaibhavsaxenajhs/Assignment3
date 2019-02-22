const JWT= require('jsonwebtoken');
const CONSTANTS = require('./constants')

function generateToken(payLoad) {
    return new Promise((resolve, reject) => {
        JWT.sign(payLoad, CONSTANTS.KEY, function (err, token) {
            if (!err)
                resolve(token);
            reject(err)
        });
    })
}

const verifyToken = (token)=>{
    return new Promise((resolve,reject)=>{
        JWT.verify(token,CONSTANTS.KEY,(err,token)=>{
            if (!err)
                resolve(token);
            reject(err)
        })
    })
}

module.exports = {
    generateToken,
    verifyToken
}