import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

class SimpleExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    )
  }
}

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/map" component={MyMap} />
      <Route path="/leaflet" component={SimpleExample} />
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
    this.getFirstTenCoords();
  }

  getFirstTenCoords() {
    axios.get('/api/coordinates')
      .then(res => {
        const coordinates = res.data.filter(item => item.millisecondOffset < 10000);
        // console.log("coords: " + coordinates + ", type: " + typeof(coordinates));
        //const coordinates = [{test: "asdf", another: "fdsa"}, {test: "3", another: "4"}];
        this.setState({ coords: coordinates });
        console.log("test message");
      });
  }

  render() {
    const coords = this.state.coords;

    return (
      <div>
        <h1>First 10 Coordinates: </h1>
        {coords.length ? (
          <div>
            {coords.map(item => {
              return(
                <div>
                  {JSON.stringify(item)}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No coords to find.</p>
        )}
      </div>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
