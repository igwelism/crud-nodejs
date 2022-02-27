import express from 'express'
import routes from './src/routes/todolistRoutes'
import bodyParser from 'body-parser'

const app = express()
const PORT = 8000;

// bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

routes(app)

app.get('/', (req, res) => {
    res.send(`Node and Express server running on port ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`)
})