const express = require('express');
const path = require('path');
const workoutService = require('./workout-service.js');

workoutService.loadWorkoutData('./workout-data.json').then(workoutData => {
  const app = express();

  app.use(
    express.static(path.join(__dirname, '/dist'))
  );

  app.get('/api/workoutData', (req, res) => {
    //res.json(workoutData);
    res.send('<script>var workoutData = ' + JSON.stringify(workoutData) + '</script>');
    console.log('Sent workout data');
  });

  app.get('/api/coordinates', (req, res) => {
    workoutService.getCoordinates(workoutData).then(coordinates => {
      res.json(coordinates);
      //res.send('<script>var coordinates = ' + JSON.stringify(coordinates) + '</script>');
      console.log('Sent coordinates');
    }).catch(err => {
      throw err;
    });
  });

  app.get('/api/events', (req, res) => {
    workoutService.getEvents(workoutData).then(events => {
      res.json(events);
      console.log('Sent events');
    }).catch(err => {
      throw err;
    });
  });

  app.get('/api/eventsRounded', (req, res) => {
    workoutService.getEventsRounded(workoutData).then(events => {
      res.json(events);
      console.log('Sent rounded events');
    }).catch(err => {
      throw err;
    });
  });

  app.get('/api/powerOutput', (req, res) => {
    workoutService.getPowerOutput(workoutData).then(events => {
      res.json(events);
      console.log('Sent power output data');
    }).catch(err => {
      throw err;
    });
  });

  app.get('/api/bestEffort', (req, res) => {
    if (!req.query.timeFrame) {
      return res.status(422).send({
        message: "timeFrame is a required query parameter and must be a non-negative integer expressing the millisecond duration within which to check for best effort."
      });
    }
    let timeFrame = Number(req.query.timeFrame);
    if (timeFrame < 0) {
      return res.status(422).send({
        message: "timeFrame must be a non-negative integer expressing the millisecond duration within which to check for best effort."
      });
    }
    workoutService.getBestEffort(workoutData, timeFrame).then(bestEffort => {
      res.json(bestEffort);
      console.log(`Sent best effort for ${timeFrame/1000} second time-frame.`);
    }).catch(err => {
      throw err;
    });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });

  const port = process.env.PORT || 3000;
  app.listen(port);

  console.log('App is listening on port ' + port);
}).catch(err => {
  throw err;
});


