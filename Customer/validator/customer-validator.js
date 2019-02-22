const JOI = require('joi')
const HTTP_RESPONSE = require('../../utils/http-response')
const MAIN_VALIDATION = require('../../validator/validation');
const TOKEN = require('../../utils/token')
const DB_QUERIES = require('../../Database/db_queries')
const BCRYPT = require('bcrypt')

const signUp = async (req, res, next) => {
    const schema = JOI.object().keys({
        firstName: JOI.string().required(),
        lastName: JOI.string().optional(),
        email: JOI.string().email({ minDomainAtoms: 2 }).required(),
        password: JOI.string().min(5).max(100).required(),
        mobileNumber: JOI.string().min(10).max(13).required()
    })
    try {
        let status = await MAIN_VALIDATION.validateSignUp(req, schema);
        if (status)
            next();
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password }, {});
    }
}

const login = async (req, res, next) => {
    const schema = JOI.object().keys({
        email: JOI.string().email({ minDomainAtoms: 2 }).required(),
        password: JOI.string().min(5).max(100).required()
    });
    try {
        let status = await MAIN_VALIDATION.validateLogin(req, schema);
        if (status) {
            next();
        }
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { firstName: req.query.firstName, lastName: req.query.lastName, email: req.query.email, mobileNumber: req.query.mobileNumber, password: req.query.password }, {});
    }
}

const validateBooking = async (req, res, next) => {
    const schema = JOI.object().keys({
        token: JOI.string().required(),
        pickupLat: JOI.string().required(),
        pickupLong: JOI.string().required(),
        dropLat: JOI.string().required(),
        dropLong: JOI.string().required()
    })
    try {
        let status = await MAIN_VALIDATION.validateSignUp(req, schema);
        if (status)
            next();
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { pickupLat: req.body.pickupLat, pickupLong: req.body.pickupLong, dropLat: req.body.dropLat, dropLong: req.body.dropLong }, {});
    }
}

const tokenVerification = async (req, res, next) => {
    try {
        //verify token of customer
        let status = await TOKEN.verifyToken(req.body.token)
        //verifying hashpassword from database
        let hashPassword = await DB_QUERIES.getPassword(status.email)
        //comparing password
        let hashResult = await BCRYPT.compare(status.password, hashPassword[0].password)
        if (hashResult) {
            next()
        }
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { pickupLat: req.body.pickupLat, pickupLong: req.body.pickupLong, dropLat: req.body.dropLat, dropLong: req.body.dropLong }, {});
    }
}

module.exports = {
    signUp,
    login,
    validateBooking,
    tokenVerification
}