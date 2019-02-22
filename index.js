const EXPRESS=require('express')
const BODYPARSER=require("body-parser");
const USER_ROUTE=require('./routes/user-route')
const ADMIN_ROUTE=require('./routes/admin-route')
const DRIVER_ROUTE=require('./routes/driver-route')
const STARTUP_SERVICES=require('./services/service-startup')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const APP = EXPRESS()
APP.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

APP.use(BODYPARSER.json())
APP.use(BODYPARSER.urlencoded({extended:true}))
APP.use('/user',USER_ROUTE)
APP.use('/admin',ADMIN_ROUTE)
APP.use('/driver',DRIVER_ROUTE)

APP.listen(4500,()=>{
    //storing admins automatcally in db
    STARTUP_SERVICES.createAdmin();
})
            