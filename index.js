//===================Imports===================
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
const pg = require('pg').native;
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/rongjiwang";

//===================Start Express=============
var port = process.env.PORT || 8080;
var client;
var app = express();

client = new pg.Client(connectionString);
client.connect();

//====================States===================
app.use(express.static(__dirname +'/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//===================GET Request===============

//Root
app.get('/', function(req,res){
    res.render('index');
});

//Show all data
app.get('/all', function(req,res){
    const results = [];
    //Get a Postgres client from the connection pool
    pg.connect(connectionString, (err,client,done) => {
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM todo');
        //Stream results back one row at a time
    query.on('row', (row) => {
        results.push(row);
});
    // After all data is returned, close connection and return results
    query.on('end', () => {
        done();
    return res.json(results);
});
});
});

//quick search data by id
/*app.get('/:id', function(req,res){
    var _id = req.params.id;
    //console.log(plainData[_id]);
    res.send(plainData[_id]);

});*/

//add data from url
app.get('/add/:job/:description', function(req,res){
    var _job = req.params.job;
    var _description = req.params.description;
    //create new data object
    var _new = {
        "id": plainData.length,
        "job": _job,
        "description": _description,
        "status": "todo"
    };
    //add into database file
    plainData.push(_new);
    var da = JSON.stringify(plainData, null, 2);
    //write into database file
    fs.writeFile('database.json', da, function(){
        console.log('all set ');

    });

    res.send(plainData);
});


//===================POST Request=================
app.post('/todo', (req,res,next) => {
    const results = [];
    //Grab data from http request
    const data = {
        job : req.body.job,
        description: req.body.description,
        is_finished: req.body.is_finished
    };
    pg.connect(connectionString, (err, client, done) =>{
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Insert Data
        client.query('INSERT INTO todo VALUES (DEFAULT, $1, $2, $3)',
            [data.job, data.description, data.is_finished]);
        // SQL Query > Select All
        const query = client.query('SELECT * FROM todo');
        // Stream results back one row at a time
        query.on('row', (row)=>{
            results.push(row);
        });
        //After all data is returned, close connection and return results
        query.on('end', ()=>{
            done();
            return res.json(results);
        });
    });
    //console.log(req.body.job+' 123');
    //client.query("INSERT INTO todo VALUES (default, 'report', '99pages', true)");
    //res.send(plainData);
});

//===================DELETE Request===============
app.delete('/del/:id', function(req,res){
    //delete plainData[req.params.id];
    res.send(req.params.id);
});

//===================Local Temp Database(local testing)==========

    //var rawData = fs.readFileSync('database.json');
    //var plainData = JSON.parse(rawData);
    //console.log(plainData);

//===================Postgres Database==========



//===================Server Start=================
app.listen(port, function(){
   console.log('Rongji app listening on port 8080.');
});
