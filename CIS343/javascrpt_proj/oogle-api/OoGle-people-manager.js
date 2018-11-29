// The API toolkit for making REST systems easily
const express = require('express');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');
// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');
// Creating array instance of database objects
const db = [database];
// Getting db keys
const dbKeys = Object.keys(database);

// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on
const port = 3000;

// Apply our middleware so our code can natively handle JSON easily

app.use(bodyParser.json());

/**************************************/
/* Adding additional middleware to gracefully handle JSON errors */
/* Adapted from: https://stackoverflow.com/questions/40142928/how-do-you-reject-an-invalid-json-body-using-express-or-body-parser */
/**************************************/
app.use((err, req, res, next) => {
	console.log("Improper JSON Request!");
  // body-parser will set this to 400 if the json is in error
  if(err.status === 400){
    return res.status(err.status).send("Hey man, that isn't JSON");
  }
  return next(err); // if it's not a 400, let the default error handling do it. 
});

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

// Build our routes

// Send the database
app.get('/', (req, res) => {
  res.send(db);
});

// Send all users with SID
app.get('/:id', (req, res) => {
  const id = req.params.id;
  var list = [];
  db.forEach(e => {
	if(e.SID === id){
       list.push(e);
	}
  });
  /* If id is not found, send Not Found */
  if(list.length == 0){
	res.sendStatus(404);
  } else {
    res.send(list);
  }
});

app.put('/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;  
  var i = db.length - 1;
  /* Updating fields of items with PUT request ID */
  console.log("ID", id);
  while(i >= 0){
	console.log(db[i].SID);
	if(db[i].SID === id){
      dbKeys.forEach(key => {
		if(body[key]){
		  db[i][key] = body[key];
		} else {}
	  });  
	}
	i--;
  }
  res.send(`Updated values with ID: ${id}`);
});

app.post('/', (req, res) => {
  const body = req.body;
  const bodyKeys = Object.keys(body);
  /* Putting data into appropriate structure */
  let data = {};
  dbKeys.forEach(key => {
	if(body[key]){
      data[key] = body[key];
	} else {
	  data[key] = "";
	}
  }); 
  db.push(data);
  res.send(`You sent: ${JSON.stringify(body)}`);
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE
app.all('*', (req, res) => {
  res.sendStatus(403);
});

app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});
