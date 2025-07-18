const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = 8000;

// DB Connection
require('./config/db'); // DB connect file
const adminTbl = require('./models/adminTbl');

// Set view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Home Route
app.get('/', async (req, res) => {
    try {
        const alldata = await adminTbl.find({});
        res.render('form', { record: alldata, user: {} });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send("Error fetching data");
    }
});

// Insert Route
app.post('/insertData', upload.single('image'), async (req, res) => {
    try {
        const { name, email, password, phone, city } = req.body;
        let image = req.file ? req.file.filename : null;
        const newUser = new adminTbl({ name, email, password, phone, city, image });
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).send("Error saving data");
    }
});

// Edit Route
app.get('/editData', async (req, res) => {
    try {
        const userId = req.query.id;
        const user = await adminTbl.findById(userId);
        const allRecords = await adminTbl.find({});
        if (!user) return res.status(404).send("User not found");
        res.render('form', { user, record: allRecords });
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).send("Error fetching data");
    }
});

// Update Route
app.post('/updateData', upload.single('image'), async (req, res) => {
    try {
        const userId = req.query.id;
        const { name, email, password, phone, city } = req.body;
        const updateData = { name, email, password, phone, city };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        await adminTbl.findByIdAndUpdate(userId, updateData);
        res.redirect('/');
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).send("Error updating data");
    }
});

// Delete Route
app.get('/deleteData', async (req, res) => {
    try {
        const userId = req.query.id;
        await adminTbl.findByIdAndDelete(userId);
        res.redirect('/');
    } catch (err) {
        console.log("Error: " + err);
        res.status(500).send("Error deleting data");
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
