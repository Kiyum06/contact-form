// Import the express module
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import session from 'express-session';
import { validateContactForm } from './validation.js';

// Load the environment variables from .env file
dotenv.config();

// Create an express appliocation
const app = express();

//Define a port number where server will listen
const PORT = 3005; 

// Enable static file serving 
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// form data and store it in req.body 
app.use(express.urlencoded({extended: true}));

// added session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//create a temp array to store submission
const submissions = [];

// Create a database connection pool with multiple connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Database test route
app.get('/db-test', async (req, res) => {
    try {
  const submissions = await pool.query('SELECT * FROM forms');
       res.send(submissions[0]);
    } catch (err) {
       console.error('Database error:', err);
       res.status(500).send('Database error: ' + err.message);
    }
});

// Define main route ('/')
app.get('/', (req, res) => {
    res.render('home');
});


// Define contact form route ('/')
app.get('/contact', (req, res) => {
     res.render('contact');
});

// portfolio route
app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});


// // admin route ('/')
// app.get('/admin', (req, res) => {
//     res.render('admin', { submissions });
// });

// app.get('/admin', async (req, res) => {
//     try {
        
//         const [submissions] = await pool.query('SELECT * FROM forms ORDER BY timestamp DESC');  
//         // Render the admin page
//         res.render('admin', { submissions });        
//     } catch (err) {
//         console.error('Database error:', err);
//         res.status(500).send('Error loading orders: ' + err.message);
//     }
// });

app.get('/admin', (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }

    const error = req.session.error;
    req.session.error = null;

    res.render('admin-login', { error });
});

// checks username and password from .env
app.post('/admin', (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        req.session.isAdmin = true;
        return res.redirect('/admin/dashboard');
    }

    req.session.error = 'Invalid username or password.';
    res.redirect('/admin');
});

// protected admin page moved to /admin/dashboard
app.get('/admin/dashboard', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/admin');
    }

    try {
        const [submissions] = await pool.query('SELECT * FROM forms ORDER BY timestamp DESC');  
        res.render('admin', { submissions });        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});


// admin logout route
app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin');
    });
});

app.post('/submit-form', async (req, res) => {

    try {

        // Call validation function
        const { errors, submission } = validateContactForm(req.body);

        // If validation fails
        if (errors.length > 0) {
            return res.status(400).render('contact', { errors });
        }

        submission.timestamp = new Date();

        console.log('New form submitted:', submission);

        const sql = `
            INSERT INTO forms(fname, lname, jobTitle, company, linkedin, email, how, other, message) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const params = [
            submission.fname,
            submission.lname,
            submission.jobTitle,
            submission.company,
            submission.linkedin,
            submission.email,
            submission.how,
            submission.other,
            submission.message
        ];

        const result = await pool.execute(sql, params);

        console.log('Form saved with ID:', result[0].insertId);

        res.render('confirmation', { submission });

    } catch (err) {
        console.error('Error saving form:', err);
        res.status(500).send('Sorry, there was an error processing your submission.');
    }
});

// Start server and listed on designed port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});