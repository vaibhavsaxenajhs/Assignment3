const JOI = require('joi')
const HTTP_RESPONSE = require('../../utils/http-response')
const MAIN_VALIDATION = require('../../validator/validation');
const CONNECTION = require('../../Database/create-db-connection')
let Promise = require('bluebird')

const login = Promise.coroutine(function* (req, res, next) {
    const schema = JOI.object().keys({
        email: JOI.string().email({ minDomainAtoms: 2 }).required(),
        password: JOI.string().min(5).max(100).required()
    });
    try {
        let status = yield MAIN_VALIDATION.validateLogin(req, schema);
        if (status)
            next();
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { email: req.query.email, password: req.query.password }, {});
    }
})

const validateBookings = Promise.coroutine(function* (req, res, next) {
    const schema = JOI.object().keys({
        token: JOI.string().required()
    })
    try {
        let status = yield MAIN_VALIDATION.validateLogin(req, schema);
        if (status)
            next()
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { token: req.query.token }, {});
    }
})

const validateData = Promise.coroutine(function* (req, res, next) {
    const schema = JOI.object().keys({
        token: JOI.string().required(),
        status: JOI.string().required()
    })
    try {
        let status = yield MAIN_VALIDATION.validateLogin(req, schema);
        if (status)
            next()
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { token: req.query.token }, {});
    }
})

const validationData = async (req, res, next) => {
    const schema = JOI.object().keys({
        token: JOI.string().required(),
        bookingId: JOI.string().required(),
        driverId: JOI.string().required(),
    })
    try {
        let status = await MAIN_VALIDATION.validateSignUp(req, schema);
        if (status)
            next()
    }
    catch (error) {
        HTTP_RESPONSE.fail(res, error.message, { token: req.body.token, bookingId: req.body.bookingId, driverId: req.body.driverId }, {});
    }
}

module.exports = {
    login,
    validateBookings,
    validateData,
    validationData
}