import "babel-polyfill"
const workoutService = require('./workout-service.js');

it('should format coordinate data correctly', done => {
  workoutService.getCoordinates(testWorkoutData).then(coordinateData => {
    expect(coordinateData).toEqual(
      [
        {
          "millisecondOffset": 0
        },
        {
          "millisecondOffset": 1000
        },
        {
          "millisecondOffset": 2000
        },
        {
          "millisecondOffset": 3000
        },
        {
          "millisecondOffset": 4000,
          "positionLat": 40.01488,
          "positionLong": -105.131
        },
        {
          "millisecondOffset": 5000,
          "positionLat": 40.01495,
          "positionLong": -105.131
        },
        {
          "millisecondOffset": 6000,
          "positionLat": 40.01503,
          "positionLong": -105.13099
        },
        {
          "millisecondOffset": 7000,
          "positionLat": 40.01511,
          "positionLong": -105.13099
        },
        {
          "millisecondOffset": 8000,
          "positionLat": 40.01518,
          "positionLong": -105.13099
        },
        {
          "millisecondOffset": 9000,
          "positionLat": 40.01525,
          "positionLong": -105.13099
        },
        {
          "millisecondOffset": 10000,
          "positionLat": 40.01532,
          "positionLong": -105.13099
        }
      ]
    );
    done();
  });
});

it('should format event data correctly', done => {
  workoutService.getEvents(testWorkoutData).then(eventData => {
    expect(eventData).toEqual(
      [
        {
          "eventType": "start",
          "millisecondOffset": 0,
          "values": {
            "heartRate": 74,
            "cadence": 63,
            "power": 143,
            "temperature": 22,
            "elevation": 1543.4,
            "distance": 0,
            "speed": 7.231
          }
        },
        {
          "eventType": "stop",
          "millisecondOffset": 10000,
          "values": {
            "heartRate": 82,
            "cadence": 77,
            "power": 181,
            "temperature": 22,
            "elevation": 1544,
            "distance": 49.54,
            "speed": 8.378,
            "positionLat": 40.01532,
            "positionLong": -105.13099
          }
        }
      ]
    );
    done();
  });
});

it('should format rounded event data correctly', done => {
  workoutService.getEventsRounded(testWorkoutData).then(eventRoundedData => {
    expect(eventRoundedData).toEqual(
      [
        {
          "eventType": "start",
          "millisecondOffset": 0,
          "values": {
            "positionLat": 40.01488,
            "positionLong": -105.131
          }
        },
        {
          "eventType": "stop",
          "millisecondOffset": 10000,
          "values": {
            "heartRate": 82,
            "cadence": 77,
            "power": 181,
            "temperature": 22,
            "elevation": 1544,
            "distance": 49.54,
            "speed": 8.378,
            "positionLat": 40.01532,
            "positionLong": -105.13099
          }
        }
      ]
    );
    done();
  });
});

it('should format power output data correctly', done => {
  workoutService.getPowerOutput(testWorkoutData).then(powerOutputData => {
    expect(powerOutputData).toEqual(
      [
        {
          "secondOffset": 0,
          "power": 143
        },
        {
          "secondOffset": 1,
          "power": 158
        },
        {
          "secondOffset": 2,
          "power": 157
        },
        {
          "secondOffset": 3,
          "power": 157
        },
        {
          "secondOffset": 4,
          "power": 157
        },
        {
          "secondOffset": 5,
          "power": 24
        },
        {
          "secondOffset": 6,
          "power": 137
        },
        {
          "secondOffset": 7,
          "power": 99
        },
        {
          "secondOffset": 8,
          "power": 134
        },
        {
          "secondOffset": 9,
          "power": 139
        },
        {
          "secondOffset": 10,
          "power": 181
        }
      ]
    );
    done();
  });
});

it('should format best effort data correctly', done => {
  workoutService.getBestEffort(testWorkoutData, 1000).then(bestEffort => {
    expect(bestEffort).toEqual(
      {
        "totalPowerOutput": 181,
        "startTime": 9000,
        "endTime":10000
      }
    );
    done();
  });
});

it('should calculate the correct best effort within a 3 second timeframe', done => {
  workoutService.getBestEffort(testWorkoutData, 3000).then(bestEffort => {
    expect(bestEffort.totalPowerOutput).toEqual(472);
    done();
  });
});

it('should calculate the correct best effort within a 5 second timeframe', done => {
  workoutService.getBestEffort(testWorkoutData, 5000).then(bestEffort => {
    expect(bestEffort.totalPowerOutput).toEqual(690);
    done();
  });
});

const testWorkoutData = 
{
  "channelSet": [
    "heartRate",
    "cadence",
    "power",
    "temperature",
    "elevation",
    "distance",
    "speed",
    "positionLat",
    "positionLong"
  ],
  "isEventBased": true,
  "samples": [
    {
      "eventType": "start",
      "millisecondOffset": 0,
      "values": {
        "heartRate": 74,
        "cadence": 63,
        "power": 143,
        "temperature": 22,
        "elevation": 1543.4,
        "distance": 0,
        "speed": 7.231
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 1000,
      "values": {
        "heartRate": 74,
        "cadence": 66,
        "power": 158,
        "temperature": 22,
        "elevation": 1543.4,
        "distance": 0
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 2000,
      "values": {
        "heartRate": 75,
        "cadence": 69,
        "power": 157,
        "temperature": 22,
        "elevation": 1543.4,
        "distance": 0
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 3000,
      "values": {
        "heartRate": 77,
        "cadence": 71,
        "power": 157,
        "temperature": 22,
        "elevation": 1543.4,
        "distance": 0
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 4000,
      "values": {
        "heartRate": 79,
        "cadence": 71,
        "power": 157,
        "temperature": 22,
        "elevation": 1543.4,
        "distance": 0,
        "speed": 7.231,
        "positionLat": 40.01488,
        "positionLong": -105.131
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 5000,
      "values": {
        "heartRate": 79,
        "cadence": 37,
        "power": 24,
        "temperature": 22,
        "elevation": 1544,
        "distance": 8.24,
        "speed": 7.983,
        "positionLat": 40.01495,
        "positionLong": -105.131
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 6000,
      "values": {
        "heartRate": 81,
        "cadence": 74,
        "power": 137,
        "temperature": 22,
        "elevation": 1544,
        "distance": 17.07,
        "speed": 8.296,
        "positionLat": 40.01503,
        "positionLong": -105.13099
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 7000,
      "values": {
        "heartRate": 82,
        "cadence": 75,
        "power": 99,
        "temperature": 22,
        "elevation": 1544,
        "distance": 25.49,
        "speed": 8.202,
        "positionLat": 40.01511,
        "positionLong": -105.13099
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 8000,
      "values": {
        "heartRate": 82,
        "cadence": 76,
        "power": 134,
        "temperature": 22,
        "elevation": 1544,
        "distance": 33.16,
        "speed": 7.842,
        "positionLat": 40.01518,
        "positionLong": -105.13099
      }
    },
    {
      "eventType": "none",
      "millisecondOffset": 9000,
      "values": {
        "heartRate": 82,
        "cadence": 76,
        "power": 139,
        "temperature": 22,
        "elevation": 1544,
        "distance": 40.92,
        "speed": 7.971,
        "positionLat": 40.01525,
        "positionLong": -105.13099
      }
    },
    {
      "eventType": "stop",
      "millisecondOffset": 10000,
      "values": {
        "heartRate": 82,
        "cadence": 77,
        "power": 181,
        "temperature": 22,
        "elevation": 1544,
        "distance": 49.54,
        "speed": 8.378,
        "positionLat": 40.01532,
        "positionLong": -105.13099
      }
    }
  ]
}