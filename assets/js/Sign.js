import React, { Component } from 'react';

class Sign extends Component {
  render() {
    return (
      <div className="viewer--sign">
        <div className="viewer--sign-id">{this.props.signId}</div>
        <div className="viewer--sign-lines">
          <div className="viewer--sign-line">{this.props.lineOne}</div>
          <div className="viewer--sign-line">{this.props.lineTwo}</div>
        </div>
      </div>
    );
  }
}

export default Sign;
