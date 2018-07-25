import React, { Component } from 'react';

class Viewer extends Component {
  render() {
    return(
      <ul>
        {this.props.messages.map( msg => {
          return(
            <li key={msg}>{msg}</li>
          );
        })}
      </ul>
    );
  }
}

export default Viewer
