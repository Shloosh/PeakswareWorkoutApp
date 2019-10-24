const fs = require('fs').promises;

async function loadWorkoutData(file) {
  return await fs.readFile('./workout-data.json').then((data) => {
    return JSON.parse(data);
  });
}

module.exports = {
  loadWorkoutData
}