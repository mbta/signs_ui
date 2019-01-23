import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import { signConfigType } from './types';

function updateConfig(setConfigsFn, realtimeId, signConfig, expires) {
  const newConfig = {
    ...signConfig,
    expires: expires
  };

  setConfigsFn({
    [realtimeId]: newConfig
  });
}

function SetExpiration({
  realtimeId, signConfig, setConfigs
}) {
  return (
    <div>
      <strong>
        Schedule return to "On"
      </strong>

      <DatePicker
        selected={signConfig.expires}
        onChange={(dt) => updateConfig(setConfigs, realtimeId, signConfig, dt)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMM d @ h:mm aa"
      />
      {signConfig.expires && (
        <a
          href="#"
          onClick={() => updateConfig(setConfigs, realtimeId, signConfig, null)}
        >[x]</a>)
      }
    </div>
  );
}

SetExpiration.propTypes = {
  realtimeId: PropTypes.string.isRequired,
  signConfig: signConfigType.isRequired,
  setConfigs: PropTypes.func.isRequired,
};

export default SetExpiration;
