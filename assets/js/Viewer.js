import React, { Component } from 'react';
import Sign from './Sign';

class Viewer extends Component {
  render() {
    return(
      <ul>
        {Object.keys(this.props.signs).map( (key, index) => {

        })}
      </ul>
      <div>{JSON.stringify(this.props.signs)}</div>
    );
  }
}

export default Viewer
