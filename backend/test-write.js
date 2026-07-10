const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kshirsagaraditya9112_db_user:Aditya9112__%40%40@cluster0.17w9bg9.mongodb.net/moviesapp?retryWrites=true&w=majority&appName=Cluster0"

console.log("Testing write connection to:", MONGO_URI)

const UserSchema = new mongoose.Schema({
  username: String,
})
const TestUser = mongoose.model('TestUser', UserSchema)

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Successfully connected! Attempting to write a test document...")
    const doc = new TestUser({ username: "test_check_" + Date.now() })
    await doc.save()
    console.log("Write success! Document saved successfully.")
    
    console.log("Attempting to find the document...")
    const found = await TestUser.findOne({ username: doc.username })
    console.log("Find success! Found document:", found)

    console.log("Cleaning up test document...")
    await TestUser.deleteOne({ _id: doc._id })
    console.log("Cleanup success!")
    
    process.exit(0)
  })
  .catch(err => {
    console.error("Failed to connect or perform operation:", err)
    process.exit(1)
  })
