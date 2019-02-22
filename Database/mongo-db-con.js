//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {

if (err)
console.log(err);
exports.dbo = db.db("mycab_logs");
});