import express from 'express';
import mysql from 'mysql2';

const app = express();
const PORT = 3005;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: '143.198.224.58',
    user: 'admin',
    password: 'adminpass0603',
    database: 'contact_form_db'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/admin', (req, res) => {
    const sql = 'SELECT * FROM forms ORDER BY timestamp DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error fetching submissions:', err);
            return res.status(500).send('Error loading admin page');
        }

        res.render('admin', { submissions: results });
    });
});

app.post('/submit-form', (req, res) => {
    const { fname, lname, email, jobTitle, company, linkedin, how, other, message } = req.body;

    const sql = `
        INSERT INTO forms
        (fname, lname, email, jobTitle, company, linkedin, how, other, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [fname, lname, email, jobTitle, company, linkedin, how, other, message];

    db.execute(sql, values, (err) => {
        if (err) {
            console.log('Error inserting submission:', err);
            return res.status(500).send('Error saving form submission');
        }

        const submission = {
            fname,
            lname,
            email,
            jobTitle,
            company,
            linkedin,
            how,
            other,
            message,
            timestamp: new Date()
        };

        res.render('confirmation', { submission });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});









// // Import the express module
// import express from 'express';
// import mysql2 from 'mysql2';

// // Create an express appliocation
// const app = express();

// //Define a port number where server will listen
// const PORT = 3005; 

// // Enable static file serving 
// app.use(express.static('public'));

// // Set EJS as the view engine
// app.set('view engine', 'ejs');

// // form data and store it in req.body 
// app.use(express.urlencoded({extended: true}));

// //create a temp array to store submission
// const submissions = [];

// // Define main route ('/')
// app.get('/', (req, res) => {
//     res.render('home');
// });


// // Define contact form route ('/')
//  app.get('/contact', (req, res) => {
//      res.render('contact');
//  });


// // admin route ('/')
// app.get('/admin', (req, res) => {
//     res.render('admin', { submissions });
// });

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

// // Start server and listed on designed port
// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });