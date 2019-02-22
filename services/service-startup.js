const CONSTANTS = require('../utils/constants')
const DB_QUERIES = require('../Database/db_queries')
const HTTP_RESPONSE = require('../utils/http-response')
const HASH_PASSWORD = require('../utils/hashPassword')

async function createAdmin() {
    let password1, password2
    try {
        //hashpassword for admins
        let response1 = await HASH_PASSWORD.generateHash(CONSTANTS.ADMIN1_PASSWORD)
        let response2 = await HASH_PASSWORD.generateHash(CONSTANTS.ADMIN2_PASSWORD)
        password1 = response1;
        password2 = response2;
    }
    catch (error) {
        HTTP_RESPONSE.fail_log(400, error.message, "")
    }

    let values = [[1, CONSTANTS.ADMIN1_FIRST_NAME, CONSTANTS.ADMIN1_LAST_NAME, CONSTANTS.ADMIN1_EMAIL, password1],
    [2, CONSTANTS.ADMIN2_FIRST_NAME, CONSTANTS.ADMIN2_LAST_NAME, CONSTANTS.ADMIN2_EMAIL, password2]]
    try {
        let result = await DB_QUERIES.insertAdminInDb(values);
        if (result) {
            console.log("admin created")
        }
    }
    catch (error) {
        HTTP_RESPONSE.fail_log(400, error.message, {})
    }
}

module.exports = {
    createAdmin
}