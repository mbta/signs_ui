import React, { Component } from 'react';

class Sign extends Component {
  render() {
    return (
      <div className="sign">
        <div>id: {this.props.signId}</div>
        <div>lineOne: {this.props.lineOne}</div>
        <div>lineTwo: {this.props.lineTwo}</div>
      </div>
    );
  }
}

export default Sign;
