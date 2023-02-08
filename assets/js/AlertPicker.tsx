import * as React from 'react';
import { RouteAlerts } from './types';
import { formatTime } from './helpers';

interface AlertPickerPopupProps {
  alerts: RouteAlerts;
  setIsOpen: (isOpen: boolean) => void;
  onChange: (alertId: string) => void;
}

function AlertPickerPopup({
  alerts,
  onChange,
  setIsOpen,
}: AlertPickerPopupProps): JSX.Element | null {
  const alertIds = Object.keys(alerts);
  const [hoveredAlertId, setHoveredAlertId] = React.useState<string>(
    alertIds[0],
  );
  const hoveredAlert = hoveredAlertId && alerts[hoveredAlertId];

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="alert_picker--container">
      <div className="alert_picker--sidebar">
        {alertIds.map((alertId) => (
          <button
            className={`alert_picker--alert_id${
              alertId === hoveredAlertId ? ' alert_picker--alert_id-active' : ''
            }`}
            key={alertId}
            onMouseEnter={() => setHoveredAlertId(alertId)}
            onClick={() => {
              onChange(alertId);
            }}
            value={alertId}
            type="button"
          >
            {alertId}
          </button>
        ))}
      </div>
      <div className="alert_picker--content">
        {!hoveredAlert ? (
          'No alert selected'
        ) : (
          <>
            <div>{hoveredAlert.service_effect}</div>
            <div className="alert_picker--created_at">
              Created {formatTime(hoveredAlert.created_at)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface AlertPickerProps {
  alertId: string;
  alerts: RouteAlerts;
  onChange: (alertId: string) => void;
  startOpen?: boolean;
  disabled: boolean;
}

function AlertPicker({
  alertId,
  alerts,
  onChange,
  startOpen = false,
  disabled,
}: AlertPickerProps): JSX.Element | null {
  // if alerts change out from under us, AlertPickerPopup should re-render,
  // since it relies on the presence of alerts.
  const popupKey = JSON.stringify(Object.keys(alerts).sort());
  const [open, setOpen] = React.useState(startOpen);

  if (open) {
    return (
      <AlertPickerPopup
        key={popupKey}
        setIsOpen={setOpen}
        alerts={alerts}
        onChange={(newAlertId) => {
          setOpen(false);
          onChange(newAlertId);
        }}
      />
    );
  }
  return (
    <div className="alert_picker--form">
      <input
        className="alert_picker--input"
        aria-label="Alert ID picker"
        disabled={disabled}
        type="text"
        value={alertId}
        onClick={() => {
          setOpen(true);
        }}
        readOnly
      />
      {Object.keys(alerts).length === 0 ? (
        <div className="alert_picker--no_alerts">
          There are currently no active alerts for this line.
        </div>
      ) : null}
    </div>
  );
}

export default AlertPicker;
