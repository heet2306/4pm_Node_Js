const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = 8000;

// DB Connection
require('./config/db'); // Assumes you connect to MongoDB here
const adminTbl = require('./models/adminTbl');

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetype = /jpeg|jpg|png|gif/;
        const extname = filetype.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetype.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// GET: Home page with form + data
app.get('/', (req, res) => {
    adminTbl.find({})
        .then((alldata) => {
            res.render('form', { record: alldata, user: {} });
        })
        .catch((err) => {
            console.log("Error fetching data:", err);
            res.status(500).send("Error loading data");
        });
});

// POST: Insert new user
app.post('/insertData', upload.single('image'), (req, res) => {
    const { name, email, password, phone, city } = req.body;
    let imagePath = null;

    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
    }

    const newUser = new adminTbl({ name, email, password, phone, city, image: imagePath });

    newUser.save()
        .then(() => res.redirect('/'))
        .catch((err) => {
            console.log("Error inserting data:", err);
            res.status(500).send("Insertion error");
        });
});

// GET: Edit form
app.get('/editData', (req, res) => {
    const userId = req.query.id;

    Promise.all([
        adminTbl.findById(userId),
        adminTbl.find({})
    ])
        .then(([user, allRecords]) => {
            if (!user) return res.status(404).send("User not found");

            res.render('edit', {
                user: user,
                record: allRecords
            });
        })
        .catch((err) => {
            console.log("Error fetching edit data:", err);
            res.status(500).send("Error loading edit page");
        });
});

// POST: Update user
app.post('/updateData', upload.single('image'), (req, res) => {
    const userId = req.query.id;
    const { name, email, password, phone, city } = req.body;

    let updateData = { name, email, password, phone, city };

    if (req.file) {
        updateData.image = '/uploads/' + req.file.filename;
    }

    adminTbl.findByIdAndUpdate(userId, updateData)
        .then(() => res.redirect('/'))
        .catch((err) => {
            console.log("Update error:", err);
            res.status(500).send("Update error");
        });
});

// GET: Delete user
app.get('/deleteData', (req, res) => {
    const userId = req.query.id;

    adminTbl.findByIdAndDelete(userId)
        .then(() => res.redirect('/'))
        .catch((err) => {
            console.log("Delete error:", err);
            res.status(500).send("Delete error");
        });
});

// Start server
app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
