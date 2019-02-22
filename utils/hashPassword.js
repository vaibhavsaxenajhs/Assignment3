const bcrypt=require('bcrypt');
const CONSTANTS=require('./constants')

function  generateHash(password){
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password,CONSTANTS.SALT_ROUNDS,function(error,hash){
            if(error)
            {
             reject(error)
            }else{
                resolve(hash)
            }
        })
    })
}

module.exports = {
    generateHash
}