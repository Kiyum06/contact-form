// Import the express module
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

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


// // admin route ('/')
// app.get('/admin', (req, res) => {
//     res.render('admin', { submissions });
// });

app.get('/admin', async (req, res) => {
    try {
        
        const [submissions] = await pool.query('SELECT * FROM forms ORDER BY timestamp DESC');  
        // Render the admin page
        res.render('admin', { submissions });        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

// // Define /sumbit-form route ('/')
// app.post('/submit-form', (req, res) => {

//     // create a json object to store the submission data
//     const submission = {
//         fname: req.body.fname,
//         lname: req.body.lname,
//         email: req.body.email,
//         jobTitle: req.body.jobTitle,
//         company: req.body.company,
//         linkedin: req.body.linkedin,
//         how: req.body.how,
//         other: req.body.other,
//         message: req.body.message,
//         timestamp: new Date()
//     };

//     // Add submission object to submissions array 
//     submissions.push(submission);

//     res.render('confirmation', { submission });
// });


// Confirmation route - handles form submission
app.post('/submit-form', async (req, res) => {

    try {
        // Get form data from req.body
        const submission = req.body;        

        submission.timestamp = new Date();
        

        // Log the order data (for debugging)
        console.log('New form submitted:', submission);


        // SQL INSERT query with placeholders to prevent SQL injection
        const sql = `INSERT INTO forms(fname, lname, jobTitle, company, linkedin, email, how, other, message) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        
        const params = [
            submission.fname,
            submission.lname,
            submission.jobTitle,
            submission.company,
            submission.linkedin,
            submission.email,
            submission.how,
            submission.other,
            submission.message,

        ];
        // Execute the query and grab the primary key of the new row
        const result = await pool.execute(sql, params);
        console.log('Form saved with ID:', result[0].insertId);
        // Render confirmation page with the adoption data
        res.render('confirmation', { submission });        
    } catch (err) {
        console.error('Error saving form:', err);
        res.status(500).send('Sorry, there was an error processing your submission. Please try again.');
    }
});

// Start server and listed on designed port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});