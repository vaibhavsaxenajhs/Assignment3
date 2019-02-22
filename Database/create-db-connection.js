
let mysql = require("mysql")

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "password",
    database: "db_mycab"
});

connection.connect((error) => {
    if (error) {
        console.log("not connected")
    } else {
        console.log("connected")
    }
})

module.exports = {
    connection,
    mysql
}
