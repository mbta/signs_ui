import React from 'react';
import PropTypes from 'prop-types';

function Sign({ signId, lineOne, lineOneDuration, lineTwo, lineTwoDuration, currentTime }) {
  let remainingTimeOne = Date.parse(lineOneDuration) - currentTime
  let remainingTimeTwo = Date.parse(lineTwoDuration) - currentTime
  let topLine = null
  let bottomLine = null
  if(remainingTimeOne > 0) {
    topLine = lineOne
  }
  if(remainingTimeTwo > 0) {
    bottomLine = lineTwo
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
  lineOneExpiration: PropTypes.instanceOf(Date),
  lineTwo: PropTypes.string,
  lineTwoExpiration: PropTypes.instanceOf(Date),
};

export default Sign;
