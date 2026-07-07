const mongoose = require('mongoose')
const uri = "mongodb+srv://kshirsagaraditya9112_db_user:Aditya9112__%40%40@cluster0.17w9bg9.mongodb.net/?appName=Cluster0"

console.log("Attempting to connect with new password...")
mongoose.connect(uri)
  .then(() => {
    console.log("Success!")
    process.exit(0)
  })
  .catch(err => {
    console.error("Failed:", err)
    process.exit(1)
  })
