const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let records = [];
let idCounter = 1;

// Home page - list all records
app.get('/', (req, res) => {
    res.render('index', { records });
});

// Form to create new record
app.get('/new', (req, res) => {
    res.render('new');
});

// Create record
app.post('/create', (req, res) => {
    const { name } = req.body;
    const date = new Date().toLocaleString();
    records.push({ id: idCounter++, name, date });
    res.redirect('/');
});

// Edit form
app.get('/edit/:id', (req, res) => {
    const record = records.find(r => r.id == req.params.id);
    if (record) {
        res.render('edit', { record });
    } else {
        res.redirect('/');
    }
});

// Update record
app.post('/update/:id', (req, res) => {
    const { name } = req.body;
    const id = parseInt(req.params.id);
    const record = records.find(r => r.id === id);
    if (record) {
        record.name = name;
        record.date = new Date().toLocaleString();
    }
    res.redirect('/');
});

// Delete record
app.get('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    records = records.filter(r => r.id !== id);
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log("Server Running On PORT " + PORT);
});
