import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import { SignConfig, SignConfigs } from './types';

function stringify(expires: Date | null) {
  if (expires) {
    return expires.toISOString();
  }

  return null;
}

function updateConfig(
  setConfigsFn,
  realtimeId: string,
  signConfig: SignConfig,
  expires: Date | [Date, Date] | null,
) {
  if (Array.isArray(expires)) {
    return;
  }
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

interface SetExpirationProps {
  realtimeId: string;
  signConfig: SignConfig;
  setConfigs: (x: SignConfigs) => void;
  readOnly: boolean;
}

function SetExpiration({
  realtimeId,
  signConfig,
  setConfigs,
  readOnly,
}: SetExpirationProps): JSX.Element | null {
  return !!signConfig.expires || !readOnly ? (
    <div>
      {(!readOnly && <strong>Schedule return to &quot;Auto&quot;</strong>) || (
        <strong>Scheduled return to &quot;Auto&quot;</strong>
      )}

      <ReactDatePicker
        selected={parseDate(signConfig.expires)}
        onChange={(dt) => updateConfig(setConfigs, realtimeId, signConfig, dt)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMM d @ h:mm aa"
        disabled={readOnly}
      />

      {signConfig.expires && !readOnly && (
        <button
          className="viewer--cancel-expiration-button"
          type="button"
          onClick={() => updateConfig(setConfigs, realtimeId, signConfig, null)}
        >
          Cancel
        </button>
      )}
    </div>
  ) : null;
}

export default SetExpiration;
