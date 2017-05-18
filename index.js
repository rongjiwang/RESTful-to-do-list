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

//Show all data in plain text
app.get('/todo/:id', function(req,res){
    const results = [];
    var id = req.params.id;
    //Get a Postgres client from the connection pool
    pg.connect(connectionString, (err,client,done) => {
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM todo WHERE id=($1)',[id]);
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

//SETUP all data from database to front end
app.get('/todo', (req,res,next)=>{
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) =>{
        // Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM todo');
        // Stream results back one row at a time
        query.on('row', (row)=>{
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', ()=>{
            done();
            return res.json(results);
        });
    });
});

//===================POST Request=================
app.post('/todo', (req,res,next) => {
    const results = [];
    //Grab data from http request
    var _job = req.body.job,
        _description =req.body.description,
        _is_finished = req.body.is_finished;
    if(_job == null){_job = 'DEFAULT';}
    if(_description == null){_description = 'DEFAULT';}
    if(_is_finished == null){_is_finished = false;}
    const data = {
        job : _job,
        description: _description,
        is_finished: _is_finished
    };
    pg.connect(connectionString, (err, client, done) =>{
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Insert Data
        var query = client.query('INSERT INTO todo(id, job, description, is_finished) VALUES (DEFAULT, $1, $2, $3) RETURNING id',
            [data.job, data.description, data.is_finished]);
        // SQL Query > Select All
        // Stream results back one row at a time
        query.on('row', (row)=>{
            results.push(row);
        });
        //After all data is returned, close connection and return results
        query.on('end', ()=>{
            done();
            console.log('[OK] The item has been added.');
            return res.json(results);
        });
    });
});

//===================UPDATE Request===============
app.put('/todo/:id',function(req,res,next){
    const results = [];
    //Grab data from the URL parameters
    var id_update = req.params.id;
    console.log(id_update);
    //Grab data from http request
    const data = {job: req.body.job, description: req.body.description, is_finished:req.body.is_finished};
    //Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done)=>{
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        if(data.is_finished){
            console.log(data.is_finished);
        }
        //SQL Query > Update Data
        client.query('UPDATE todo SET job=($1), description=($2), is_finished=($3) WHERE id=($4)',
            [data.job, data.description, data.is_finished, id_update]);
        const query = client.query('SELECT * FROM todo');
        // Stream results back one row at a time
        query.on('row', (row)=>{
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', ()=>{
            done();
            console.log('[OK] The item has been updated.');
            return res.json(results);
        })
    });

});

//===================DELETE Request===============
app.delete('/todo/:id', function(req,res,next){
    var results = [];
    //Grab data from the URL parameters
    var id = req.params.id;
    //Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) =>{
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Delete Data
        client.query('DELETE FROM todo where id=($1)',[id]);
        const query = client.query('SELECT * FROM todo');
        // Stream results back one row at a time
        query.on('row', (row)=>{
            results.push(row);
        });
        // Close the connection
        query.on('end', ()=>{
            done();
            console.log('[OK] The item has been deleted.');
            return res.json(results);
        });
    });
});

//===================Local Temp Database(local testing)==========

    //var rawData = fs.readFileSync('database.json');
    //var plainData = JSON.parse(rawData);
    //console.log(plainData);

//===================Server Start=================
app.listen(port, function(){
   console.log('Rongji app listening on port 8080.');
});