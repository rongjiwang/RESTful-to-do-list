//===================Imports===================
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

//===================Start Express=============
var app = express();
var port = process.env.PORT || 8080;

//====================States===================
app.use(express.static(__dirname +'/project1'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//===================GET Request===============
app.get('/', function(req,res){
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
var pg = require('pg').native;
var connectionString = process.env.DATABASE_URL;
var client = new pg.Client(connectionString);
client.connect();
app.get('/db', function (request, response) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM todo', function(err, result) {
            done();
            console.log('test_test');
            if (err)
            { console.error(err); response.send("Error " + err); }
            else
            { response.render({results: result.rows} ); }
        });
    });
});


//===================Server Start=================
app.listen(port, function(){
   console.log('Rongji app listening on port 8080.');
});
