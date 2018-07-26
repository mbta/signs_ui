import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sign from './Sign';

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.sortedKeys = this.sortedKeys.bind(this);
  }

  sortedKeys() {
    const { signs } = this.props;
    return Object.keys(signs).sort();
  }

  render() {
    return (
      <div>
        {this.sortedKeys().map((key) => {
          const { signs } = this.props;
          const lines = signs[key];
          return <Sign key={key} signId={key} lineOne={lines[0]} lineTwo={lines[1]} />;
        })}
      </div>
    );
  }
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default Viewer;
