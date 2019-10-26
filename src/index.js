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
  Marker
} from 'react-leaflet';
import { Label, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';

const data = [
  { name: 1, cost: 4.11, impression: 100 },
  { name: 2, cost: 2.39, impression: 120 },
  { name: 3, cost: 1.37, impression: 150 },
  { name: 4, cost: 1.16, impression: 180 },
  { name: 5, cost: 2.29, impression: 200 },
  { name: 6, cost: 3, impression: 499 },
  { name: 7, cost: 0.53, impression: 50 },
  { name: 8, cost: 2.52, impression: 100 },
  { name: 9, cost: 1.79, impression: 200 },
  { name: 10, cost: 2.94, impression: 222},
  { name: 11, cost: 4.3, impression: 210 },
  { name: 12, cost: 4.41, impression: 300 },
  { name: 13, cost: 2.1, impression: 50 },
  { name: 14, cost: 8, impression: 190 },
  { name: 15, cost: 0, impression: 300 },
  { name: 16, cost: 9, impression: 400 },
  { name: 17, cost: 3, impression: 200 },
  { name: 18, cost: 2, impression: 50 },
  { name: 19, cost: 3, impression: 100 },
  { name: 20, cost: 7, impression: 100 }
];

const getAxisYDomain = (from, to, ref, offset) => {
	const refData = data.slice(from-1, to);
  let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
  refData.forEach( d => {
  	if ( d[ref] > top ) top = d[ref];
    if ( d[ref] < bottom ) bottom = d[ref];
  });
  
  return [ (bottom|0) - offset, (top|0) + offset ]
};

const initialState = {
  data,
  left : 'dataMin',
  right : 'dataMax',
  refAreaLeft : '',
  refAreaRight : '',
  top : 'dataMax+1',
  bottom : 'dataMin-1',
  top2 : 'dataMax+20',
  bottom2 : 'dataMin-20',
  animation : true
};

class ZoomLineChart extends React.Component {

	constructor(props) {
    super(props);
    this.state = initialState;
  }
  
  zoom(){  
  	let { refAreaLeft, refAreaRight, data } = this.state;

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
    const [ bottom, top ] = getAxisYDomain( refAreaLeft, refAreaRight, 'cost', 1 );
    const [ bottom2, top2 ] = getAxisYDomain( refAreaLeft, refAreaRight, 'impression', 50 );
    
    this.setState( () => ({
      refAreaLeft : '',
      refAreaRight : '',
    	data : data.slice(),
      left : refAreaLeft,
      right : refAreaRight,
      bottom, top, bottom2, top2
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
      top : 'dataMax+1',
      bottom : 'dataMin',
      top2 : 'dataMax+50',
      bottom: 'dataMin+50'
    }) );
  }
  
  render() {
    const { data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = this.state;

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
            width={800}
            height={400}
            data={data}
            onMouseDown = { (e) => this.setState({refAreaLeft:e.activeLabel}) }
            onMouseMove = { (e) => this.state.refAreaLeft && this.setState({refAreaRight:e.activeLabel}) }
            onMouseUp = { this.zoom.bind( this ) }
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis 
              allowDataOverflow={true}
              dataKey="name"
              domain={[left, right]}
              type="number"
            />
            <YAxis 
              allowDataOverflow={true}
              domain={[bottom, top]}
              type="number"
              yAxisId="1"
             />
            <YAxis 
              orientation="right"
              allowDataOverflow={true}
              domain={[bottom2, top2]}
              type="number"
              yAxisId="2"
             /> 
            <Tooltip/>
            <Line yAxisId="1" type='natural' dataKey='cost' stroke='#8884d8' animationDuration={300}/>
            <Line yAxisId="2" type='natural' dataKey='impression' stroke='#82ca9d' animationDuration={300}/>
            
            {
            	(refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
            
            }
            
          </LineChart> 

      </div>
    );
  }
}

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
      <Route path="/chart" component={ZoomLineChart} />
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
      coords: [],
      events: []
    }
  }

  componentDidMount() {
    this.getCoords();
    this.getEvents();
  }

  getCoords() {
    axios.get('/api/coordinates')
      .then(res => {
        const coordinates = res.data;
        this.setState({ coords: coordinates });
      });
  }

  getEvents() {
    axios.get('/api/eventsRounded')
      .then(res => {
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

ReactDOM.render(<Root/>, document.getElementById('root'));
