const express = require('express');
const { result } = require('lodash');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// code that will connect the application to the MySql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySql username
        user: 'root',
        // your MySQL password
        password: 'Foskco420!',
        database: 'election'
    },
    console.log('Connected to the election database')
);

app.get('/', (req,res) => {
    res.json({
        message: 'Hello World'
    });
});

// all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    // will return all the data in the 'candidates' table
    // the 'db' object is using the 'query()' method.
    //      - this method runs the SQL query and executes the callback with all the resulsting rows that match the query
    db.query(sql, (err, rows) => {
        if (err) {
            // we'll send a status code of 500 and place the error message within a JSON object
            res.status(500).json({ error: err.message });
            // the return statement will exit the database call once an error is encountered
            return;
        }
        // we'll send this reponse as a JSON object to the browser, using 'res'
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get a single candidate
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    //  we'll assign the captured value populated in the 'req.params' object with the key 'id'  to 'params'
    const params = [req.params.id];
    
    // the database call will
    //  - query the 'candidates' table with this id and retrieve a specific row
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
});

// delete a candidate api endpoint
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            // why res.message here?
            res.status(400).json({ error: res.message });
        }
        // If there are no affectedRows as a result of the delete query, that means that there was no candidate by that id. Therefore, we should return an appropriate message to the client, such as "Candidate not found".
        // this prevents it for saying you deleted something, when you didn't. For example, if you tried to delete an id that din't exist, it wouldn't come up as an error
        else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        }
        else {
            res.json({
                message: 'deleted',
                // 'this will verify whether any rows were changed (wouldn't the message do that? i am not understanding this)
                // it seems to let you know how many rows were affected
                changes: result.affectedRows,
                // shows the id of the row affected
                id: req.params.id
            });
        }
    });
});

// Create a candidats
// ({ body })
//  - we'll use the object req.body to populate the candidate's data.
//  - Notice that we're using object destructuring to pull the body property out of the request object. 
//  - Until now, we've been passing the entire request object to the routes in the req parameter.
app.post('/api/candidate', ({ body }, res) => {
    // inputCheck() is a a function in inputCheck.js. we imported here
    //  - this function checks that the inputs are valid
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors});
        return;
    }

    // prepared statements
    // notice there is no column for id in the prepared statements.
    //  - this is becase mysql will autogenerate the id 
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;

    // The params assignment contains three elements in its array 
    //  - that contains the user data collected in req.body.
    const params = [body.first_name, body.last_name, body.industry_connected];

    // Using the query() method, we can execute the prepared SQL statements.
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
// VALUES (?,?,?,?)`;

// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });


// Default response for any other request (Not Found). That's why it doesn't havea specified route
// catchall
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});