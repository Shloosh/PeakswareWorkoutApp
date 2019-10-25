import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/test" component={Test} />
    </Switch>
  </Router>
);

const App = () => (
  <div>
    <h1>Hello World!</h1>
  </div>
);

const Test = () => (
  <div>
    <h1>Test page</h1>
  </div>
);

ReactDOM.render(<Root/>, document.getElementById('root'));
