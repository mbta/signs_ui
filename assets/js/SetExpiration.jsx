import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { signConfigType } from './types';

function stringify(expires) {
  if (expires) {
    return expires.toISOString();
  }

  return null;
}

function updateConfig(setConfigsFn, realtimeId, signConfig, expires) {
  const expirationConfig = stringify(expires);

  const newConfig = {
    ...signConfig,
    expires: expirationConfig,
  };

  setConfigsFn({
    [realtimeId]: newConfig,
  });
}

function parseDate(str) {
  if (str) {
    const date = new Date(str);

    if (date.toString() !== 'Invalid Date') {
      return date;
    }
  }

  return null;
}

function SetExpiration({
  realtimeId, signConfig, setConfigs, readOnly,
}) {
  return (signConfig.expires || !readOnly) && (
    <div>
      {(!readOnly
        && (
          <strong>
            Schedule return to &quot;Auto&quot;
          </strong>
        ))
       || (
         <strong>
           Scheduled return to &quot;Auto&quot;
         </strong>
       )}

      <DatePicker
        selected={parseDate(signConfig.expires)}
        onChange={(dt) => updateConfig(setConfigs, realtimeId, signConfig, dt)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMM d @ h:mm aa"
        disabled={readOnly}
      />

      {signConfig.expires
        && !readOnly
        && (
          <button
            className="viewer--cancel-expiration-button"
            type="button"
            onClick={() => updateConfig(setConfigs, realtimeId, signConfig, null)}
          >
            Cancel
          </button>
        )}
    </div>
  );
}

SetExpiration.propTypes = {
  realtimeId: PropTypes.string.isRequired,
  signConfig: signConfigType.isRequired,
  setConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default SetExpiration;
