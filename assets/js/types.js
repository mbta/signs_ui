import PropTypes from 'prop-types';

const signConfigType = PropTypes.oneOfType([
  PropTypes.shape({ mode: PropTypes.oneOf(['off']), expires: PropTypes.string }),
  PropTypes.shape({ mode: PropTypes.oneOf(['auto']) }),
  PropTypes.shape({
    mode: PropTypes.oneOf(['static_text']),
    line1: PropTypes.string.isRequired,
    line2: PropTypes.string.isRequired,
    expires: PropTypes.string,
  }),
]);

const signContentType = PropTypes.shape({
  sign_id: PropTypes.string.isRequired,
  lines: PropTypes.objectOf(PropTypes.shape({
    text: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })).isRequired,
    expiration: PropTypes.string,
  })),
});

const multiSignHeadwayConfigType = PropTypes.shape({
  range_low: PropTypes.number.isRequired,
  range_high: PropTypes.number.isRequired,
  non_platform_text_line1: PropTypes.string,
  non_platform_text_line2: PropTypes.string,
});

export { signConfigType, signContentType, multiSignHeadwayConfigType };
