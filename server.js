const express = require('express');
const path = require('path');
const workoutService = require('./workout-service.js');

workoutService.loadWorkoutData('./workout-data.json').then(data => {
  const workoutData = data;
  console.log(JSON.stringify(workoutData.channelSet));

  const app = express();

  app.use(
    express.static(path.join(__dirname, '/dist'))
  );

  app.get('/api/workoutData', (req, res) => {
    //res.json(workoutData);
    res.send('<script>var workoutData = ' + JSON.stringify(workoutData) + '</script>');
    console.log('Sent workout data');
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });

  const port = process.env.PORT || 3000;
  app.listen(port);

  console.log('App is listening on port ' + port);
});


