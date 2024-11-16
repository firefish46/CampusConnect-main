const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded resources
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'campusconnect'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes
app.get('/api/departments', (req, res) => {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/intakes/:departmentId', (req, res) => {
    const { departmentId } = req.params;
    db.query('SELECT * FROM intakes WHERE department_id = ?', [departmentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/sections/:intakeId', (req, res) => {
    const { intakeId } = req.params;
    db.query('SELECT * FROM sections WHERE intake_id = ?', [intakeId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/courses/:sectionId', (req, res) => {
    const { sectionId } = req.params;
    db.query('SELECT * FROM courses WHERE section_id = ?', [sectionId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/resources/:courseId', (req, res) => {
    const { courseId } = req.params;
    db.query('SELECT * FROM resources WHERE course_id = ?', [courseId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/resources/:courseId/upload', upload.single('file'), (req, res) => {
    const { courseId } = req.params;
    const { title, type } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    db.query(
        'INSERT INTO resources (course_id, title, type, file_path) VALUES (?, ?, ?, ?)',
        [courseId, title, type, filePath],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Resource uploaded successfully', resourceId: results.insertId });
        }
    );
});

app.get('/api/notices', (req, res) => {
    db.query('SELECT * FROM notices', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/lost-and-found', (req, res) => {
    db.query('SELECT * FROM lost_and_found', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});