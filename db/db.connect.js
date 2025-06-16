const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeDb = async () => {
  await mongoose
     .connect(mongoUri)
     .then(() => {
        console.log("Connectd to Database")
     })
     .catch((error) => console.log("Error connecting to Database", error))
}

module.exports = { initializeDb }