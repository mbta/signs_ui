import React from 'react';
import PropTypes from 'prop-types';
import Sign from './Sign';

function Viewer({ signs, currentTime }) {
  return (
    <div>
      {
        Object.keys(signs).sort().map((key) => {
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
        })
      }
    </div>
  );
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default Viewer;
