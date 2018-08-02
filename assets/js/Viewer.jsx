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
          const { signs, currentTime } = this.props;
          const lines = signs[key];
          return (
            <Sign
              key={key}
              signId={key}
              lineOne={lines[0].text}
              lineOneDuration={lines[0].duration}
              lineTwo={lines[1].text}
              lineTwoDuration={lines[1].duration}
              currentTime={currentTime}
            />
          );
        })}
      </div>
    );
  }
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default Viewer;
