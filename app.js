// Import the express module
import express from 'express';

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

// Define main route ('/')
app.get('/', (req, res) => {
    res.render('home');
});


// Define contact form route ('/')
 app.get('/contact', (req, res) => {
     res.render('contact');
 });


// admin route ('/')
app.get('/admin', (req, res) => {
    res.render('admin', { submissions });
});

// Define /sumbit-form route ('/')
app.post('/submit-form', (req, res) => {

    // create a json object to store the submission data
    const submission = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        jobTitle: req.body.jobTitle,
        company: req.body.company,
        linkedin: req.body.linkedin,
        how: req.body.how,
        other: req.body.other,
        message: req.body.message,
        timestamp: new Date()
    };

    // Add submission object to submissions array 
    submissions.push(submission);

    res.render('confirmation', { submission });
});

// Start server and listed on designed port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});