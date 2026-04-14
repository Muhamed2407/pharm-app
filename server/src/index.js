// ...existing code...
const express = require('express')
const cors = require('cors')
// ...existing code...

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  optionsSuccessStatus: 200,
}))
app.use(express.json())
// ...existing code...

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
// ...existing code...