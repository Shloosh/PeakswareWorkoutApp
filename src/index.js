import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/map" component={Map} />
    </Switch>
  </Router>
);

const App = () => (
  <div>
    <h1>Hello World!</h1>
  </div>
);

class Map extends Component {
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
