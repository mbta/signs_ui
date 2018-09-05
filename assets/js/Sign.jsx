import React from 'react';
import PropTypes from 'prop-types';
import lineToColor from './colors';

function displayLine(duration, currentTime) {
  return (Date.parse(duration) - currentTime) > 0;
}

function fontSize(signId) {
  if (signId === 'NB' || signId === 'SB' || signId === 'EB' || signId === 'WB' || signId === 'MZ' || signId === 'CN') {
    return { fontSize: '1.5em' };
  }
  return {};
}

function Sign({
  signId, lineOne, lineOneDuration, lineTwo, lineTwoDuration, currentTime, line,
}) {
  return (
    <div className="viewer--sign">
      <div className="viewer--sign-id" style={{ borderTopColor: lineToColor(line) }}>
        <span style={fontSize(signId)}>
          {signId}
        </span>
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
  line: PropTypes.string.isRequired,
};

Sign.defaultProps = {
  lineOne: null,
  lineOneDuration: '0',
  lineTwo: null,
  lineTwoDuration: '0',
};

export default Sign;
