const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// EJS
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Create a connection
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'nodemysql'
});

// Connect to MySQL database
db.connect((error) => {
    if(error){
        console.log(error)
    };
    console.log('MySQL connected ...');
});

// Home Page 
app.get('/', (req, res) => {
    //Query to  all the vehicles from the MySQL database
    let sql = 'SELECT * FROM vehicle'; 
    let query = db.query(sql, (err, data) => {
        if(err) throw err;
        console.log(data);
        res.render('index', {
            results: data,
        });

    });
    //res.send('connected');
});

// Add a new vehicle route
app.get('/addvehicle', (req, res) => {
    res.render('addvehicle'); //render the page addvehicle.ejs
});

// Delete a vehicle page
app.get('/deletevehicle', (req, res) => {
    //Query to all the vehicles from the MySQL database
    let sql = 'SELECT * FROM vehicle';
    // Execute the query then proceed with a callback function
    let query = db.query(sql, (err, data) => {
        if(err) throw err; //Error handling
        //Render the page deletevehicle.ejs and pass in the JSON data along with it.
        res.render('deletevehicle', {
            results: data,
        });
    });
});

// Insert new vehicle into DB
app.post('/new_vehicle', (req, res, next) => {
    let vehicle = {
        year,
        make,
        model,
        color
    } = req.body;
    let sql = 'INSERT INTO vehicle SET ?';
    let query = db.query(sql, vehicle, (err, result) => {
        if(err) throw err;
        console.log(result);
    });
    res.redirect('/addvehicle');
});

//Delete a vehicle from DB
app.post('/delete_vehicle', (req, res) => {
    let vehicleID = req.body.selectpicker;
    let sql = `DELETE FROM vehicle WHERE id = ${vehicleID}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.redirect('/deletevehicle');
    });
});

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (error, result) => {
        if(error) throw error;
        console.log(result);
        res.send('Database created');
    });
});

// Create vehicles table
app.get('/createvehiclestable', (req, res) => {
    let sql = 'CREATE TABLE vehicle (id int AUTO_INCREMENT, year int, make VARCHAR(50), model VARCHAR(50), color VARCHAR(50), PRIMARY KEY (id))';
    db.query(sql, (error, result) => {
        if(error){
            console.log(error);
        }
        console.log(result);
        res.redirect('/');
    });
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));