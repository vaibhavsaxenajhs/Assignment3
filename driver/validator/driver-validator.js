const JOI = require('joi')
const HTTP_RESPONSE = require('../../utils/http-response')
const MAIN_VALIDATION = require('../../validator/validation');
const Promise = require('bluebird')

/*
*@function <b> insert admin details </b><br>
*@param {string} email
*@param {string} first name
*@param {string} last name
*@param {string} password
*@param {string} mobile number
*/
const signUp = Promise.coroutine(function* (req, res, next) {
    const schema = JOI.object().keys({
        firstName: JOI.string().required(),
        lastName: JOI.string().optional(),
        email: JOI.string().email({ minDomainAtoms: 2 }).required(),
        password: JOI.string().min(5).max(100).required(),
        mobileNumber: JOI.string().min(10).max(13).required(),
        licenceNumber: JOI.string().required()
    })
    try {
        let status = yield MAIN_VALIDATION.validateSignUp(req, schema);
        if (status)
            next();
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, mobileNumber: req.body.mobileNumber, password: req.body.password, licenceNumber: req.body.licenceNumber }, {});
    }
})

/*
*@function <b> insert admin details </b><br>
*@param {string} email
*@param {string} password
*/
const login = (req, res, next) => {
    const schema = JOI.object().keys({
        email: JOI.string().email({ minDomainAtoms: 2 }).required(),
        password: JOI.string().min(5).max(100).required()
    });
    Promise.coroutine(function* () {
        let status = yield MAIN_VALIDATION.validateLogin(req, schema);
        if (status)
            next();
    })().catch((error) => {
        HTTP_RESPONSE.fail(res, error.message, { firstName: req.query.firstName, lastName: req.query.lastName, email: req.query.email, mobileNumber: req.query.mobileNumber, password: req.query.password, licenceNumber: req.query.licenceNumber }, {});
    })
}

/*
*@function <b> insert admin details </b><br>
*@param {string} token
*@param {string} status
*/
const validateBookings = (req, res, next) => {
    const schema = JOI.object().keys({
        token: JOI.string().required(),
        status: JOI.string().required()
    })
    Promise.coroutine(function* () {
        let status = yield MAIN_VALIDATION.validateLogin(req, schema);
        if (status)
            next()
    })().catch(() => {
        HTTP_RESPONSE.fail(res, error.message, { token: req.query.token, status: req.query.status }, {});

    })


}

/*
*@function <b> insert admin details </b><br>
*@param {string} token
*@param {string} booking id
*/
const validateComplete = Promise.coroutine(function* (req, res, next) {
    const schema = JOI.object().keys({
        token: JOI.string().required(),
        bookingId: JOI.string().required()
    })
    try {
        let status = yield MAIN_VALIDATION.validateSignUp(req, schema);
        if (status)
            next()
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.details[0].message, { token: req.body.token, status: req.body.status }, {})
    }
})

module.exports = {
    signUp,
    login,
    validateBookings,
    validateComplete
}
