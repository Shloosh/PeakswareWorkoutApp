import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WorkoutMap from './components/WorkoutMap.js'
import PowerOutputChart from './components/PowerOutputChart.js';
import BestEfforts from './components/BestEfforts.js';

const App = () => (
  <div>
    <h1>Hello World!</h1>
  </div>
);

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/map" component={WorkoutMap} />
      <Route path="/chart" component={PowerOutputChart} />
      <Route path="/bestEfforts" component={BestEfforts} />
    </Switch>
  </Router>
);

ReactDOM.render(<Root/>, document.getElementById('root'));
