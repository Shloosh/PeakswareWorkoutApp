const fs = require('fs').promises;

/**
 * Load the workout data into a JSON object and return it.
 * 
 * @param {string} file A string path to the .json file containing our workout data.
 */
async function loadWorkoutData(file) {
  const workoutData = await fs.readFile(file);
  return JSON.parse(workoutData);
}

/**
 * Extract and format coordinate data from workoutData.
 * 
 * @param {object} workoutData JSON object of our workout data.
 */
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

/**
 * Extract and format event data from workoutData.
 * 
 * @param {object} workoutData JSON object of our workout data.
 */
async function getEvents(workoutData) {
  return workoutData.samples.filter(sample => sample.eventType !== "none");
}

/**
 * Same as getEvents function, but if a start or stop event happens on a sample where 
 * positional data isn't being recorded, push it to the nearest sample that has positional 
 * data. This way, we can associate every start or stop event with a location.
 * 
 * @param {object} workoutData JSON object of our workout data.
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

/**
 * Extract and format power output data from workoutData.
 * 
 * @param {object} workoutData JSON object of our workout data.
 */
async function getPowerOutput(workoutData) {
  return workoutData.samples.filter(sample => sample.values.power !== undefined).map((sample, i) => ({ secondOffset: sample.millisecondOffset/1000, power: sample.values.power }));
}

/**
 * Calculates the best cumulative power output within a rolling timeFrame over the provided workoutData. Works in O(n) time.
 * 
 * @param {object} workoutData  JSON object of our workout data.
 * @param {int} timeFrame       A timeframe to search for the best effort.
 * 
 * TODO: Figure out a way to process timeFrame as an array of timeFrames, so that requests can be grouped together
 */
async function getBestEffort(workoutData, timeFrame) {
  const startingTime = workoutData.samples[0].millisecondOffset;
  const endingTime = workoutData.samples[workoutData.samples.length-1].millisecondOffset;
  const duration = endingTime-startingTime;

  let bestEffort = "N/A";
  if (duration < timeFrame) {
    return bestEffort;
  } else {
    bestEffort = {
      totalPowerOutput: 0,
      startTime: 0,
      endTime: 0
    };
  }

  let sampleFromTimeFrameAgo = workoutData.samples[0];
  sampleFromTimeFrameAgo.currentIndex = 0;
  let sampleFromTimeFrameAgoNextIndex;
  let rollingTimeFrameEffort = 0;
  let timeSinceFirstSample;
  let currentSampleMillisecondOffset, currentSamplePower;

  for (let i = 0; i < workoutData.samples.length; i++) {
    timeSinceFirstSample = currentSampleMillisecondOffset - startingTime;
    currentSampleMillisecondOffset = workoutData.samples[i].millisecondOffset;
    // TODO: There may be a better way to handle undefined power values in a sample
    currentSamplePower = workoutData.samples[i].values.power ? workoutData.samples[i].values.power : 0;

    if (timeSinceFirstSample < timeFrame) {
      rollingTimeFrameEffort += currentSamplePower;
    } else {
      rollingTimeFrameEffort += (currentSamplePower - sampleFromTimeFrameAgo.values.power);

      // Increment our sample from [timeFrame] milliseconds ago
      // TODO: This doesn't work properly if there are uneven time jumps between each sample
      sampleFromTimeFrameAgoNextIndex = sampleFromTimeFrameAgo.currentIndex + 1;
      sampleFromTimeFrameAgo = workoutData.samples[sampleFromTimeFrameAgoNextIndex];
      sampleFromTimeFrameAgo.currentIndex = sampleFromTimeFrameAgoNextIndex;
    }

    if (rollingTimeFrameEffort > bestEffort.totalPowerOutput) {
      bestEffort.totalPowerOutput = rollingTimeFrameEffort;
      // Undo the sampleFromTimeFrameAgo increment from above
      bestEffort.startTime = workoutData.samples[sampleFromTimeFrameAgo.currentIndex-1].millisecondOffset;
      bestEffort.endTime = currentSampleMillisecondOffset;
    }
  }

  return bestEffort;
}

module.exports = {
  loadWorkoutData,
  getCoordinates,
  getEvents,
  getEventsRounded,
  getPowerOutput,
  getBestEffort
}