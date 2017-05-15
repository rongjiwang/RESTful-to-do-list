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
app.use(express.static(__dirname +'/project1'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//===================GET Request===============
//client.query("INSERT INTO todo VALUES (default, 'report', '9pages', true)");

app.get('/', function(req,res){
    /*    const results = [];
    pg.connect(connectionString, (err,client,done) => {
        //Handle connection errors
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        //SQL Query > Select Data
        console.log('No error');
        const query = client.query("INSERT INTO todo_list VALUES (default, 'report', '90pages', true)");
        query.on('row', (row) =>{
            results.push(row);
        });
        //Return data, close connection
        query.on('end', () =>{
            done();
            return res.json(results);
    });
});*/
   client.query("INSERT INTO todo VALUES (default, 'report', '90pages', true)");

    res.render('index');
});

//show all data
app.get('/all', function(req,res){
    res.send(plainData);

});
//quick search data by id
app.get('/:id', function(req,res){
    var _id = req.params.id;
    //console.log(plainData[_id]);
    res.send(plainData[_id]);

});

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
app.post('/insert', function(req,res){
    console.log(req.body.job+' 123');
    client.query("INSERT INTO todo VALUES (default, 'report', '99pages', true)");
    res.send(plainData);
});

//===================DELETE Request===============
app.delete('/del/:id', function(req,res){
    //delete plainData[req.params.id];
    res.send(req.params.id);
});

//===================Local Temp Database==========

    var rawData = fs.readFileSync('database.json');
    var plainData = JSON.parse(rawData);
    //console.log(plainData);

//===================Postgres Database==========

//console.log(connectionString);

//const query = client.query('CREATE TABLE item(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
//query.on('end', () => { client.end(); });

/*app.get('/dbs', function(req, res) {
    const results = [];
    const query = client.query("insert into todo_list values(default, 'report', '9pages', true)");
    //query = client.query("select * from todo_list");
    console.log(query);
    query.on('row', function(row) {
        results.push(row);
        console.log(row+'0');
    });
    query.on('end', () => {
        done();
        return res.json(results);
    });
});*/


//===================Server Start=================
app.listen(port, function(){
   console.log('Rongji app listening on port 8080.');
});
