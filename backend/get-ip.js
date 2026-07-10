const http = require('https')

console.log("Checking your current public IP address...")
http.get('https://api.ipify.org?format=json', (res) => {
  let data = ''
  res.on('data', (chunk) => data += chunk)
  res.on('end', () => {
    try {
      const ip = JSON.parse(data).ip
      console.log("\n==================================================")
      console.log("YOUR CURRENT PUBLIC IP IS:", ip)
      console.log("==================================================")
      console.log("\nTo allow your app to connect to Atlas:")
      console.log("1. Go to Network Access in MongoDB Atlas.")
      console.log("2. Click 'Add IP Address'.")
      console.log(`3. Paste this IP address: ${ip}`)
      console.log("4. Click 'Confirm' and wait 30 seconds.")
      console.log("==================================================\n")
    } catch (e) {
      console.error("Parse error:", e)
    }
  })
}).on('error', (err) => {
  console.error("Fetch error:", err)
})
