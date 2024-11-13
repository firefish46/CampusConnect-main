// Import required modules....
const express = require('express');
const mysql = require('mysql'); // Use 'mysql' package for XAMPP compatibility
const cors = require('cors');
const app = express();
const PORT = 3000;

// Use CORS middleware to handle CORS issues
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'campusconnect' // Database name you created in XAMPP
});

// Connect to MySQL database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Define API endpoints

// Get all departments
app.get('/api/departments', (req, res) => {
    const query = 'SELECT * FROM Departments';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Get intakes by department ID
app.get('/api/intakes/:departmentId', (req, res) => {
    const departmentId = req.params.departmentId;
    const query = 'SELECT * FROM Intakes WHERE department_id = ?';
    connection.query(query, [departmentId], (err, results) => {
        if (err) {
            console.error('Error fetching intakes:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Get sections by intake ID
app.get('/api/sections/:intakeId', (req, res) => {
    const intakeId = req.params.intakeId;
    const query = 'SELECT * FROM Sections WHERE intake_id = ?';
    connection.query(query, [intakeId], (err, results) => {
        if (err) {
            console.error('Error fetching sections:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Get courses by section ID
app.get('/api/courses/:sectionId', (req, res) => {
    const sectionId = req.params.sectionId;
    const query = 'SELECT * FROM Courses WHERE section_id = ?';
    connection.query(query, [sectionId], (err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Get resources by course ID
app.get('/api/resources/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const query = 'SELECT * FROM Resources WHERE course_id = ?';
    connection.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching resources:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Get notices by department ID
app.get('/api/notices/:departmentId', (req, res) => {
    const departmentId = req.params.departmentId;
    const query = 'SELECT * FROM Notices WHERE department_id = ?';
    connection.query(query, [departmentId], (err, results) => {
        if (err) {
            console.error('Error fetching notices:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Get lost-and-found items by department ID
app.get('/api/lost-and-found/:departmentId', (req, res) => {
    const departmentId = req.params.departmentId;
    const query = 'SELECT * FROM LostAndFound WHERE department_id = ?';
    connection.query(query, [departmentId], (err, results) => {
        if (err) {
            console.error('Error fetching lost-and-found items:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
