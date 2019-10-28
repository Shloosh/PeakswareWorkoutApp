import React, { Component } from 'react';
import { Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';
import axios from 'axios';

export default class PowerOutputChart extends Component {

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