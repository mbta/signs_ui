import PropTypes from 'prop-types';

const signConfigType = PropTypes.oneOfType([
  PropTypes.exact({ mode: PropTypes.oneOf(['off']), expires: PropTypes.string }),
  PropTypes.exact({ mode: PropTypes.oneOf(['auto']) }),
  PropTypes.exact({
    mode: PropTypes.oneOf(['static_text']),
    line1: PropTypes.string.isRequired,
    line2: PropTypes.string.isRequired,
    expires: PropTypes.string,
  }),
]);

// eslint-disable-next-line import/prefer-default-export
export { signConfigType };
