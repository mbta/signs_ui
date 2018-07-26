import React from 'react';
import PropTypes from 'prop-types';

function Sign({ signId, lineOne, lineTwo }) {
  return (
    <div className="viewer--sign">
      <div className="viewer--sign-id">
        {signId}
      </div>
      <div className="viewer--sign-lines">
        <div className="viewer--sign-line">
          {lineOne}
        </div>
        <div className="viewer--sign-line">
          {lineTwo}
        </div>
      </div>
    </div>
  );
}

Sign.propTypes = {
  signId: PropTypes.string.isRequired,
  lineOne: PropTypes.string.isRequired,
  lineTwo: PropTypes.string.isRequired,
};

export default Sign;
