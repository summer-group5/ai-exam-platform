// server.js
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// routes test
const testRoutes = require('./routes/testRoutes')



const app = express()

app.use(cors())
app.use(express.json())


// routes test route
app.use('/api/test', testRoutes)



app.get('/', (req, res) => {
  res.send('Backend is running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
console.log(` Server is running in address http://localhost:${PORT}`)
console.log (`Test coinnection status in address http://localhost:${PORT}/api/test`);
})