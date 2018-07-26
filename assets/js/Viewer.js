import React, { Component } from 'react';
import Sign from './Sign';

class Viewer extends Component {
  render() {
    return(
      <div>
        {this.sortedKeys(this.props.signs).map( (key, index) => {
          let lines = this.props.signs[key];
          return <Sign key={key} signId={key} lineOne={lines[0]} lineTwo={lines[1]}></Sign>
        })}
      </div>
    );
  }

  sortedKeys(signs) {
    return Object.keys(signs).slice(0).sort();
  }
}

export default Viewer
