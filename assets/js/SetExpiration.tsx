import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import { RouteAlerts, SignConfig, SignConfigs } from './types';
import AlertPicker from './AlertPicker';

function stringify(expires: Date | null) {
  if (expires) {
    return expires.toISOString();
  }

  return null;
}

function updateConfig(
  setConfigsFn: (x: SignConfigs) => void,
  realtimeId: string,
  signConfig: SignConfig,
  expires: Date | [Date, Date] | null,
  alertId: string | null,
) {
  if (Array.isArray(expires)) {
    return;
  }
  const expirationConfig = stringify(expires);

  const newConfig = {
    ...signConfig,
    expires: expirationConfig,
    alert_id: alertId,
  };

  setConfigsFn({
    [realtimeId]: newConfig,
  });
}

function parseDate(str: string | null | undefined) {
  if (str) {
    const date = new Date(str);

    if (date.toString() !== 'Invalid Date') {
      return date;
    }
  }

  return null;
}

interface SetExpirationProps {
  alerts: RouteAlerts;
  realtimeId: string;
  signConfig: SignConfig;
  setConfigs: (x: SignConfigs) => void;
  readOnly: boolean;
  showAlertSelector: boolean;
}

function SetExpiration({
  alerts,
  realtimeId,
  signConfig,
  setConfigs,
  readOnly,
  showAlertSelector,
}: SetExpirationProps): JSX.Element | null {
  const isDateTimeSelected = !!signConfig.expires;
  const isAlertSelected = !!signConfig.alert_id;
  const isNoAlerts = Object.keys(alerts).length === 0;

  return isDateTimeSelected || isAlertSelected || !readOnly ? (
    <div>
      {(!readOnly && <strong>Schedule return to &quot;Auto&quot;</strong>) || (
        <strong>Scheduled return to &quot;Auto&quot;</strong>
      )}
      <form>
        <label
          className={isAlertSelected ? 'set_expiration--label-disabled' : ''}
        >
          <input
            className="mr-1"
            type="radio"
            checked={isDateTimeSelected}
            disabled={isAlertSelected}
            readOnly
          />
          Date and time
          <div>
            <ReactDatePicker
              selected={parseDate(signConfig.expires)}
              onChange={(dt) =>
                updateConfig(setConfigs, realtimeId, signConfig, dt, null)
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMM d @ h:mm aa"
              disabled={readOnly || isAlertSelected}
            />
          </div>
          {isDateTimeSelected && !readOnly && (
            <button
              className="set_expiration--cancel"
              type="button"
              onClick={() =>
                updateConfig(setConfigs, realtimeId, signConfig, null, null)
              }
            >
              Cancel
            </button>
          )}
        </label>
        {showAlertSelector ? (
          <label
            className={
              isDateTimeSelected || isNoAlerts
                ? 'set_expiration--label-disabled'
                : ''
            }
          >
            <input
              className="mr-1"
              type="radio"
              checked={isAlertSelected}
              disabled={isDateTimeSelected || isNoAlerts}
              readOnly
            />
            At the end of an alert effect period
            <AlertPicker
              alertId={signConfig.alert_id || ''}
              alerts={alerts}
              onChange={(alertId) =>
                updateConfig(setConfigs, realtimeId, signConfig, null, alertId)
              }
              disabled={readOnly || isDateTimeSelected || isNoAlerts}
            />
            {isAlertSelected && !readOnly && (
              <button
                className="set_expiration--cancel"
                type="button"
                onClick={() =>
                  updateConfig(setConfigs, realtimeId, signConfig, null, null)
                }
              >
                Cancel
              </button>
            )}
          </label>
        ) : null}
      </form>
    </div>
  ) : null;
}

export default SetExpiration;
