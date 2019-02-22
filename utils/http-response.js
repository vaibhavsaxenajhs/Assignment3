class HttpResponse {
    static success (res, message, data) {
        return res.status(200).json({
            status:'200',
            message,
            data
            
        })
    }
    static fail (res, message, error,data) {
        return res.status(400).json({
            status:'400',
            message,
            error,
            data
        })
    }
    static fail_log(status,message,data){
        console.log({
            status ,
            message,
            data,
        })
    }
    static success_log(status,message,data){
        console.log({
            status ,
            message,
            data,
        })    
    }
}

module.exports = HttpResponse;   