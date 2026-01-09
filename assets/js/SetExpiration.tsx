import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import { RouteAlerts } from './types';
import AlertPicker from './AlertPicker';

interface SetExpirationProps {
  alerts: RouteAlerts;
  expires?: Date | null;
  alertId?: string | null;
  onDateChange: (date: Date | null) => void;
  onAlertChange: (alertId: string | null) => void;
  readOnly: boolean;
  showAlertSelector: boolean;
}

type Picker = 'date' | 'alert' | null;

function SetExpiration({
  alerts,
  expires,
  alertId,
  readOnly,
  onDateChange,
  onAlertChange,
  showAlertSelector,
}: SetExpirationProps) {
  const isDateTimeSelected = !!expires;
  const isAlertSelected = !!alertId;
  const isNoAlerts = Object.keys(alerts).length === 0;
  const [picker, setPicker] = React.useState<Picker>(null);
  const [returnsToAuto, setReturnsToAuto] = React.useState(
    isDateTimeSelected || isAlertSelected,
  );

  const focusDatePicker = () => {
    onAlertChange(null);
    setPicker('date');
  };

  const focusAlertPicker = () => {
    onDateChange(null);
    setPicker('alert');
  };

  const toggleReturnToAuto = () => {
    if (returnsToAuto) {
      onAlertChange(null);
      onDateChange(null);
      setPicker(null);
    }
    setReturnsToAuto(!returnsToAuto);
  };

  return returnsToAuto || !readOnly ? (
    <div className="set_expiration">
      {(!readOnly && (
        <label>
          <input
            className="mr-1"
            type="checkbox"
            checked={returnsToAuto}
            onClick={toggleReturnToAuto}
            readOnly
          />
          <strong>Schedule return to &quot;Auto&quot;</strong>
        </label>
      )) || <strong>Scheduled return to &quot;Auto&quot;</strong>}
      {returnsToAuto && (
        <>
          <label>
            <input
              className="mr-1 set_expiration--datetime"
              type="radio"
              checked={picker === 'date' || isDateTimeSelected}
              onChange={focusDatePicker}
              disabled={readOnly}
              readOnly
            />
            Date and time
            <div>
              {(picker === 'date' || isDateTimeSelected) && (
                <ReactDatePicker
                  selected={expires}
                  onChange={onDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMM d @ h:mm aa"
                  disabled={readOnly}
                  startOpen={picker === 'date'}
                />
              )}
            </div>
          </label>
          {showAlertSelector && (
            <label
              className={isNoAlerts ? 'set_expiration--label-disabled' : ''}
            >
              <input
                className="mr-1"
                type="radio"
                checked={picker === 'alert' || isAlertSelected}
                disabled={isNoAlerts || readOnly}
                onChange={focusAlertPicker}
                readOnly
              />
              At the end of an alert effect period
              {(picker === 'alert' || isAlertSelected) && (
                <AlertPicker
                  alertId={alertId || ''}
                  alerts={alerts}
                  onChange={onAlertChange}
                  disabled={isNoAlerts || readOnly}
                  startOpen={picker === 'alert'}
                />
              )}
            </label>
          )}
        </>
      )}
    </div>
  ) : null;
}

export default SetExpiration;
