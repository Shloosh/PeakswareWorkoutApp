import React, { Component } from 'react';
import axios from 'axios';

export default class BestEfforts extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        bestEfforts: {
          oneMinute: null,
          fiveMinutes: null,
          tenMinutes: null,
          fifteenMinutes: null,
          twentyMinutes: null
        }
      };
    }
  
    componentDidMount() {
      this.getBestEfforts();
    }
  
    getBestEfforts() {
      const oneMinute = 60000;
      const fiveMinutes = oneMinute*5;
      const tenMinutes = oneMinute*10;
      const fifteenMinutes = oneMinute*15;
      const twentyMinutes = oneMinute*20;
  
      axios.get('/api/bestEffort?timeFrame=' + oneMinute).then(res => {
        this.setState(prevState => ({
          bestEfforts: {
            ...prevState.bestEfforts,
            oneMinute: res.data
          }
        }));
      });
      axios.get('/api/bestEffort?timeFrame=' + fiveMinutes).then(res => {
        this.setState(prevState => ({
          bestEfforts: {
            ...prevState.bestEfforts,
            fiveMinutes: res.data
          }
        }));
      });
      axios.get('/api/bestEffort?timeFrame=' + tenMinutes).then(res => {
        this.setState(prevState => ({
          bestEfforts: {
            ...prevState.bestEfforts,
            tenMinutes: res.data
          }
        }));
      });
      axios.get('/api/bestEffort?timeFrame=' + fifteenMinutes).then(res => {
        this.setState(prevState => ({
          bestEfforts: {
            ...prevState.bestEfforts,
            fifteenMinutes: res.data
          }
        }));
      });
      axios.get('/api/bestEffort?timeFrame=' + twentyMinutes).then(res => {
        this.setState(prevState => ({
          bestEfforts: {
            ...prevState.bestEfforts,
            twentyMinutes: res.data
          }
        }));
      });
    }
  
    renderBestEffort(name, bestEffort) {
      if (bestEffort == "N/A") {
        return <p>{name} best effort: N/A</p>
      }
      return (<p>{name} best effort: {bestEffort.totalPowerOutput} cumulative power output between {bestEffort.startTime/1000} seconds and {bestEffort.endTime/1000} seconds.</p>);
    }
  
    render() {
      let { bestEfforts } = this.state;
      if (bestEfforts.oneMinute == null || bestEfforts.fiveMinutes == null || bestEfforts.tenMinutes == null || bestEfforts.fifteenMinutes == null || bestEfforts.twentyMinutes == null) {
        return (
          <div>
            <h1>Best Efforts:</h1>
            <p>Loading...</p>
          </div>
        );
      }
  
      return(
        <div>
          <h1>Best Efforts:</h1>
          {this.renderBestEffort("One minute", bestEfforts.oneMinute)}
          {this.renderBestEffort("Five minute", bestEfforts.fiveMinutes)}
          {this.renderBestEffort("Ten minute", bestEfforts.tenMinutes)}
          {this.renderBestEffort("Fifteen minute", bestEfforts.fifteenMinutes)}
          {this.renderBestEffort("Twenty minute", bestEfforts.twentyMinutes)}
        </div>
      );
    }
  }