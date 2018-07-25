import React, { Component } from 'react';
import Sign from './Sign';

class Viewer extends Component {
  render() {
    return(
      <ul>
        {Object.keys(this.props.signs).map( (key, index) => {
          let lines = this.props.signs[key];
          return <li key={key}><Sign signId={key} lineOne={lines[0]} lineTwo={lines[1]}></Sign></li>
        })}
      </ul>
    );
  }
}

export default Viewer
