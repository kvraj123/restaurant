const express = require('express')
require('./db/mongoose')

const Users = require('./models/user')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const menuRoutes = require('./routes/menu')
const cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json())

app.use(userRoutes)

app.use(categoryRoutes)

app.use(menuRoutes)


const port = process.env.PORT;

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
  ];
  
  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }




app.listen(port, () => {
    console.log('server is on port' +port);
})





