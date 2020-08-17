require('dotenv').config();

module.exports.connect ={
    db:process.env.MONGO_URI
}