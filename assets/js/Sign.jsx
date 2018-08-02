import React from 'react';
import PropTypes from 'prop-types';

function Sign({
  signId, lineOne, lineOneDuration, lineTwo, lineTwoDuration, currentTime,
}) {
  const remainingTimeOne = Date.parse(lineOneDuration) - currentTime;
  const remainingTimeTwo = Date.parse(lineTwoDuration) - currentTime;
  let topLine = null;
  let bottomLine = null;
  if (remainingTimeOne > 0) {
    topLine = lineOne;
  }
  if (remainingTimeTwo > 0) {
    bottomLine = lineTwo;
  }

  return (
    <div className="viewer--sign">
      <div className="viewer--sign-id">
        {signId}
      </div>
      <div className="viewer--sign-lines">
        <div className="viewer--sign-line">
          {topLine}
        </div>
        <div className="viewer--sign-line">
          {bottomLine}
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
