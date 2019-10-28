import React, { Component } from 'react';
import { Map, Polyline, Popup, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

export default class WorkoutMap extends Component {
    constructor(props) {
      super(props);
      this.state = {
        coords: [],
        events: []
      }
    }
  
    componentDidMount() {
      this.getCoords();
      this.getEvents();
    }
  
    getCoords() {
      axios.get('/api/coordinates').then(res => {
        const coordinates = res.data;
        this.setState({ coords: coordinates });
      });
    }
  
    getEvents() {
      axios.get('/api/eventsRounded').then(res => {
        const events = res.data;
        this.setState({ events: events });
      });
    }
  
    renderPopupText(event) {
      const minutes = Math.floor(event.millisecondOffset/60000);
      const seconds = (event.millisecondOffset/1000) % 60;
      switch(event.eventType) {
        case 'start': return `Start Event @ ${minutes} minutes ${seconds} seconds.`;
        case 'stop': return `Stop Event @ ${minutes} minutes ${seconds} seconds.`;
        default: return event.eventType + ` Event @ ${minutes} minutes ${seconds} seconds.`;
      }
    }
  
    render() {
      if (this.state.coords.length == 0 || this.state.events.length == 0) {
        return (<p>Loading...</p>);
      }
  
      const coords = this.state.coords.filter(c => c.positionLat && c.positionLong).map(c => [c.positionLat, c.positionLong]);
      const minLat = Math.min(...coords.map(c => c[0]));
      const maxLat = Math.max(...coords.map(c => c[0]));
      const minLong = Math.min(...coords.map(c => c[1]));
      const maxLong = Math.max(...coords.map(c => c[1]));
      const center = [(maxLat + minLat)/2, (maxLong + minLong)/2];
      console.log(`minLat: ${minLat}, maxLat: ${maxLat}, minLong: ${minLong}, maxLong: ${maxLong}, center: ${center}`);
  
      const events = this.state.events;
      return (
        <Map center={center} zoom={13}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline color="black" positions={coords} />
          {events.map(event => {
            return (
              <Marker position={[event.values.positionLat, event.values.positionLong]}>
                <Popup>
                  {this.renderPopupText(event)}
                </Popup>
              </Marker>
            )
          })}
        </Map>
      );
    }
  }