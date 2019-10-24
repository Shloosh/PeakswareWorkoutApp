const fs = require('fs').promises;

async function loadWorkoutData(file) {
  return await fs.readFile('./workout-data.json').then((data) => {
    return JSON.parse(data);
  });
}

async function getCoordinates(workoutData) {
  return new Promise((resolve) => {
    resolve(workoutData.samples.map(
      sample => 
      ({
        millisecondOffset: sample.millisecondOffset, positionLat: sample.values.positionLat, positionLong: sample.values.positionLong
      })
    ));
  });
}

module.exports = {
  loadWorkoutData,
  getCoordinates
}