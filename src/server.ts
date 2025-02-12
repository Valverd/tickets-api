import express from 'express'
import mysql from 'mysql2'

const app = express()
app.use(express.json())

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

db.connect((error) => {
    if(error) {
        console.log(error)
        return
    }
    console.log('Connected to database')
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})