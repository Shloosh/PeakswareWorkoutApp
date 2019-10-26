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

async function getEvents(workoutData) {
  return workoutData.samples.filter(sample => sample.eventType !== "none");
}

/**
 * If a start or stop event happens on a sample where positional data isn't being recorded,
 * push it to the nearest sample that has positional data. This way, we can associate every
 * start or stop event with a location.
 * 
 * TODO: simplify or break up this function
 */
async function getEventsRounded(workoutData) {
  return workoutData.samples.reduce((accum, sample, i) => {
    if (sample.eventType !== "none") {
      if (sample.values.positionLat && sample.values.positionLong) {
        accum.push(sample);
      } else {
        if (sample.eventType === "start") {
          var nextIndex = i;
          while (!workoutData.samples[nextIndex].values.positionLat && !workoutData.samples[nextIndex].values.positionLong) {
            nextIndex++;
            if (nextIndex >= workoutData.samples.length-1) {
              accum.push(sample);
              return accum;
            }
          }
          accum.push({
            "eventType": sample.eventType,
            "millisecondOffset": sample.millisecondOffset,
            "values": {
              "heartRate": sample.heartRate,
              "cadence": sample.cadence,
              "power": sample.power,
              "temperature": sample.temperature,
              "elevation": sample.elevation,
              "distance": sample.distance,
              "speed": sample.speed,
              "positionLat": workoutData.samples[nextIndex].values.positionLat,
              "positionLong": workoutData.samples[nextIndex].values.positionLong
            }
          });
        } else if (sample.eventType === "stop") {
          var prevIndex = i;
          while (!workoutData.samples[prevIndex].values.positionLat && !workoutData.samples[prevIndex].values.positionLong) {
            prevIndex--;
            if (prevIndex <= 0) {
              accum.push(sample);
              return accum;
            }
          }
          accum.push({
            "eventType": sample.eventType,
            "millisecondOffset": sample.millisecondOffset,
            "values": {
              "heartRate": sample.heartRate,
              "cadence": sample.cadence,
              "power": sample.power,
              "temperature": sample.temperature,
              "elevation": sample.elevation,
              "distance": sample.distance,
              "speed": sample.speed,
              "positionLat": workoutData.samples[prevIndex].values.positionLat,
              "positionLong": workoutData.samples[prevIndex].values.positionLong
            }
          });
        }
      }
    }
    return accum;
  }, []);
}

module.exports = {
  loadWorkoutData,
  getCoordinates,
  getEvents,
  getEventsRounded
}