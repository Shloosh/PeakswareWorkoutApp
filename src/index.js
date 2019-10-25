import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import {
  Circle,
  CircleMarker,
  Map,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet'

const center = [51.505, -0.09]

const polyline = [[51.505, -0.09], [51.51, -0.1], [51.51, -0.12]]

const multiPolyline = [
  [[51.5, -0.1], [51.5, -0.12], [51.52, -0.12]],
  [[51.5, -0.05], [51.5, -0.06], [51.52, -0.06]],
]

const polygon = [[51.515, -0.09], [51.52, -0.1], [51.52, -0.12]]

const multiPolygon = [
  [[51.51, -0.12], [51.51, -0.13], [51.53, -0.13]],
  [[51.51, -0.05], [51.51, -0.07], [51.53, -0.07]],
]

const rectangle = [[51.49, -0.08], [51.5, -0.06]]

class VectorLayersExample extends Component {
  render() {
    return (
      <Map center={center} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={center} fillColor="blue" radius={200} />
        <CircleMarker center={[51.51, -0.12]} color="red" radius={20}>
          <Popup>Popup in CircleMarker</Popup>
        </CircleMarker>
        <Polyline color="black" positions={polyline} />
        <Polyline color="black" positions={multiPolyline} />
        <Polygon color="purple" positions={polygon} />
        <Polygon color="purple" positions={multiPolygon} />
        <Rectangle bounds={rectangle} color="black" />
      </Map>
    )
  }
}

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/map" component={MyMap} />
      <Route path="/leaflet" component={VectorLayersExample} />
    </Switch>
  </Router>
);

const App = () => (
  <div>
    <h1>Hello World!</h1>
  </div>
);

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: []
    }
  }

  componentDidMount() {
    this.getCoords();
  }

  getCoords() {
    axios.get('/api/coordinates')
      .then(res => {
        const coordinates = res.data.filter(item => item.millisecondOffset);
        this.setState({ coords: coordinates });
      });
  }

  render() {
    if (this.state.coords.length == 0) {
      return (<p>Loading...</p>);
    }

    const coords = this.state.coords.filter(c => c.positionLat && c.positionLong).map(c => [c.positionLat, c.positionLong]);
    console.log(coords);
    const minLat = Math.min(...coords.map(c => c[0]));
    const maxLat = Math.max(...coords.map(c => c[0]));
    const minLong = Math.min(...coords.map(c => c[1]));
    const maxLong = Math.max(...coords.map(c => c[1]));
    const center = [(maxLat + minLat)/2, (maxLong + minLong)/2];
    console.log(`minLat: ${minLat}, maxLat: ${maxLat}, minLong: ${minLong}, maxLong: ${maxLong}, center: ${center}`);

    return (
      <Map center={center} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline color="black" positions={coords} />
      </Map>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
