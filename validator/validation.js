'***************************COMMONVALIDATIONS*************************'
const JOI=require('joi')
const HTTP_RESPONSE=require('../utils/http-response')

const validateSignUp = (req,schema)=>{
    return new Promise((resolve,reject)=>{
        JOI.validate(req.body, schema, function (error, value) {
            if (error) {
              reject(error)  
            } 
             else {  
                resolve(true)
            }
        })
    });
}

const validateLogin=(req,schema)=> {
    return new Promise((resolve,reject)=>{
        JOI.validate(req.query, schema, function (error, value){
            if (error) {
                reject(error)  
            } 
               else {  
                  resolve(true)
            }
        })
    })
}
    

module.exports={
    validateLogin,
    validateSignUp
}