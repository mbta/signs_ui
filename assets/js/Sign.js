import React, { Component } from 'react';

class Sign extends Component {
  render() {
    return (
      <div className="sign">
        <div>id: {this.props.signId}</div>
        <div>content: {JSON.stringify(this.props.content)}</div>
      </div>
    );
  }
}

export default Sign;
