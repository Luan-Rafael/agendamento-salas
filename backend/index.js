import './src/db/connection.js'
import express from 'express'
import  cors from "cors"
import { router } from './src/routes.js'
import { notFoundHandler } from './src/middlewares/not-found.js'
import {errorHandler} from './src/middlewares/error.js'
import 'express-async-errors'

export const secretKey = 'your_secret_key' 

const app = express()
app.use(cors());
app.use(express.json());
app.use('/api', router)
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(3001, () => {
  console.log(`
      Server running http://localhost:3001       
        `)
})