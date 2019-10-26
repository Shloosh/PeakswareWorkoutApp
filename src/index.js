import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import {
  Map,
  Polyline,
  Popup,
  TileLayer,
  Marker
} from 'react-leaflet';
import { Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';

class ZoomLineChart extends Component {

	constructor(props) {
    super(props);
    this.state = {
      data: [],
      left : 'dataMin',
      right : 'dataMax',
      refAreaLeft : '',
      refAreaRight : '',
      top : 'dataMax+50',
      bottom : 'dataMin',
      animation : true
    };
  }

  componentDidMount() {
    this.getPowerOutput();
  }

  getPowerOutput() {
    axios.get('/api/powerOutput').then(res => {
      this.setState({ data: res.data });
    });
  }

  getAxisYDomain (from, to, ref, offset) {
    const refData = this.state.data.slice(from-1, to);
    let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
    refData.forEach( d => {
      if ( d[ref] > top ) top = d[ref];
      if ( d[ref] < bottom ) bottom = d[ref];
    });
    
    return [ (bottom|0) - offset, (top|0) + offset ]
  };
  
  zoom(){
    let { refAreaLeft, refAreaRight, data } = this.state;

    if (data.length == 0) {
      console.log("data.length == 0");
      return;
    }

		if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
    	this.setState( () => ({
      	refAreaLeft : '',
        refAreaRight : ''
      }) );
    	return;
    }

		// xAxis domain
	  if ( refAreaLeft > refAreaRight ) 
    		[ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

		// yAxis domain
    const [ bottom, top ] = this.getAxisYDomain( refAreaLeft, refAreaRight, 'power', 50 );
    
    this.setState( () => ({
      refAreaLeft : '',
      refAreaRight : '',
    	data : data.slice(),
      left : refAreaLeft,
      right : refAreaRight,
      bottom, 
      top
    } ) );
  };

	zoomOut() {
  	const { data } = this.state;
  	this.setState( () => ({
      data : data.slice(),
      refAreaLeft : '',
      refAreaRight : '',
      left : 'dataMin',
      right : 'dataMax',
      top : 'dataMax+50',
      bottom : 'dataMin',
    }) );
  }
  
  render() {
    if (this.state.data.length == 0) {
      return (<p>Loading...</p>);
    }

    const { data, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;

    return (
      <div className="highlight-bar-charts">
        <a
          href="javascript: void(0);"
          className="btn update"
          onClick={this.zoomOut.bind( this )}
        >
          Zoom Out
        </a>

        <p>Highlight / Zoom - able Line Chart</p>
          <LineChart
            width={window.innerWidth}
            height={400}
            data={data}
            onMouseDown = { (e) => this.setState({refAreaLeft:e.activeLabel}) }
            onMouseMove = { (e) => this.state.refAreaLeft && this.setState({refAreaRight:e.activeLabel}) }
            onMouseUp = { this.zoom.bind( this ) }
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis 
              allowDataOverflow={true}
              dataKey="secondOffset"
              domain={[left, right]}
              type="number"
            />
            <YAxis 
              allowDataOverflow={true}
              domain={[bottom, top]}
              type="number"
              yAxisId="1"
             />
            <Tooltip/>
            <Line yAxisId="1" type='natural' dot={false} dataKey='power' stroke='#8884d8' animationDuration={300}/>
            
            {
            	(refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
            
            }

            <Legend/>
            
          </LineChart> 

      </div>
    );
  }
}

class MyMap extends Component {
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

const App = () => (
  <div>
    <h1>Hello World!</h1>
  </div>
);

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/map" component={MyMap} />
      <Route path="/chart" component={ZoomLineChart} />
    </Switch>
  </Router>
);

ReactDOM.render(<Root/>, document.getElementById('root'));
