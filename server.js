const express = require('express');
const path = require('path');
const fs = require('fs');

var workoutData;
fs.readFile('./workout-data.json', (err, data) => {
  if (err) throw err;
  workoutData = JSON.parse(data);
});

const app = express();

app.use(
  express.static(path.join(__dirname, '/dist'))
);

app.get('/api/workoutData', (req, res) => {
  res.json(workoutData);
  console.log('Sent workout data');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log('App is listening on port ' + port);
