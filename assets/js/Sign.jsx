import React from 'react';
import PropTypes from 'prop-types';

function displayLine(duration, currentTime) {
  return (Date.parse(duration) - currentTime) > 0;
}

function Sign({
  signId, lineOne, lineOneDuration, lineTwo, lineTwoDuration, currentTime,
}) {
  return (
    <div className="viewer--sign">
      <div className="viewer--sign-id">
        {signId}
      </div>
      <div className="viewer--sign-lines">
        <div className="viewer--sign-line">
          { displayLine(lineOneDuration, currentTime) ? lineOne : null }
        </div>
        <div className="viewer--sign-line">
          { displayLine(lineTwoDuration, currentTime) ? lineTwo : null }
        </div>
      </div>
    </div>
  );
}

Sign.propTypes = {
  signId: PropTypes.string.isRequired,
  lineOne: PropTypes.string,
  lineOneDuration: PropTypes.string,
  lineTwo: PropTypes.string,
  lineTwoDuration: PropTypes.string,
  currentTime: PropTypes.number.isRequired,
};

Sign.defaultProps = {
  lineOne: null,
  lineOneDuration: '0',
  lineTwo: null,
  lineTwoDuration: '0',
};

export default Sign;
