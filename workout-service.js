const fs = require('fs').promises;

async function loadWorkoutData(file) {
  const workoutData = await fs.readFile(file);
  return JSON.parse(workoutData);
}

async function getCoordinates(workoutData) {
  return workoutData.samples.map(
    sample => 
    ({
      millisecondOffset: sample.millisecondOffset, 
      positionLat: sample.values.positionLat, 
      positionLong: sample.values.positionLong
    })
  );
}

module.exports = {
  loadWorkoutData,
  getCoordinates
}