var pg = require('pg').native
    , connectionString = process.env.DATABASE_URL
    , client
    , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE todo(id serial primary key, job varchar(255), description varchar(255),is_finished boolean);');
query.on('end', function(result) { client.end(); });