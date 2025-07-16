const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8000

app.set('view engine', 'ejs')

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/form', (req, res) => {
    res.render('form')
})
app.post('/submit', (req, res) => {
    const { name, email } = req.body
    res.send(`Form Submitted With Name:${name},Email:${email}`)
})
app.use((req, res) => {
    res.status(404).send('404- page not get')
})
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server Is Running On ${port}`);
    }
})