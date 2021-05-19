import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import { stationConfig, arincToRealtimeId } from './mbta';
import VirtualSign from './VirtualSign';
import CustomTextInput from './CustomTextInput';
import AlertPicker from './AlertPicker';
import {
  RouteAlerts,
  StationConfig,
  Zone,
  RouteSignGroups,
  SignGroup,
} from './types';
import { defaultZoneLabel } from './helpers';

interface ZoneSelectorProps {
  config: StationConfig;
  zone: Zone;
  line: string;
  selectedSigns: { [sign: string]: boolean };
  onSignChange: (signId: string, selected: boolean) => void;
  readOnly: boolean;
  kind: 'default' | 'named';
}

function ZoneSelector({
  config,
  zone,
  line,
  selectedSigns,
  onSignChange,
  readOnly,
  kind,
}: ZoneSelectorProps): JSX.Element | null {
  const handleChange = React.useCallback(
    (evt) => {
      if (!readOnly) {
        onSignChange(evt.target.name, evt.target.checked);
      }
    },
    [onSignChange, readOnly],
  );

  const zoneConfig = config.zones[zone];

  if (
    zoneConfig === undefined ||
    (zoneConfig.label === undefined && kind === 'named') ||
    (zoneConfig.label !== undefined && kind === 'default')
  ) {
    return null;
  }

  const zoneLabel = zoneConfig.label || defaultZoneLabel(zone);
  const signId = arincToRealtimeId(`${config.id}-${zone}`, line);
  const isSelected = selectedSigns[signId] || false;

  return (
    <div>
      <label
        className={`sign_groups--zone_selector${
          isSelected ? ' sign_groups--zone_selector-selected' : ''
        }`}
      >
        <input
          type="checkbox"
          name={signId}
          checked={isSelected}
          onChange={handleChange}
        />
        {zoneLabel}
      </label>
    </div>
  );
}

interface SignGroupsFormProps {
  line: string;
  currentTime: number;
  alerts: RouteAlerts;
  setSignGroup: (line: string, ts: number, signGroup: SignGroup) => void;
  readOnly: boolean;
}

function SignGroupsForm({
  line,
  currentTime,
  alerts,
  setSignGroup,
  readOnly,
}: SignGroupsFormProps): JSX.Element | null {
  const [selectedSigns, setSelectedSigns] = React.useState<{
    [sign: string]: boolean;
  }>({});
  const [line1, setLine1] = React.useState('');
  const [line2, setLine2] = React.useState('');
  const [expireAt, setExpireAt] = React.useState<Date | null>(null);
  const [expireAlertID, setExpireAlertID] = React.useState('');

  const onDatePickerChange = React.useCallback(
    (date: Date | null) => {
      setExpireAt(date);
    },
    [setExpireAt],
  );

  const onSignChange = React.useCallback(
    (signId: string, isChecked: boolean) => {
      setSelectedSigns({ ...selectedSigns, ...{ [signId]: isChecked } });
    },
    [selectedSigns, setSelectedSigns],
  );

  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();

      const signIds = Object.entries(selectedSigns)
        .filter(([, isChecked]) => isChecked)
        .map(([id]) => id);

      const expires = expireAt ? expireAt.toISOString() : null;

      const signGroup: SignGroup = {
        sign_ids: signIds,
        line1,
        line2,
        expires,
        alert_id: expireAlertID,
      };

      setSignGroup(line, currentTime, signGroup);
    },
    [line1, line2, expireAt, expireAlertID, selectedSigns],
  );

  const stations = stationConfig[line]?.stations ?? [];

  return (
    <form onSubmit={handleSubmit}>
      <div className="sign_groups--container">
        <div className="sign_groups--container-left">
          Select Signs
          <div className="sign_groups--select_signs-container">
            <div className="d-flex border-bottom">
              <div className="sign_groups--select_signs-left_col sign_groups--select_signs-header">
                Station
              </div>
              <div className="sign_groups--select_signs-right_col sign_groups--select_signs-header">
                Sign Location
              </div>
            </div>

            {stations.map((station) => (
              <div key={station.id} className="sign_groups--select_signs-row">
                <div className="sign_groups--select_signs-left_col sign_groups--select_signs-station">
                  {station.name} ({station.id})
                </div>
                <div className="sign_groups--select_signs-right_col">
                  <div className="sign_groups--select_signs-zones">
                    <div className="sign_groups--select_signs-zone_col-defaults">
                      <div className="sign_groups--select_signs-zone_col-default">
                        {(['w', 's'] as Zone[]).map((zone) => (
                          <ZoneSelector
                            key={`${station}-${zone}`}
                            config={station}
                            zone={zone}
                            line={line}
                            selectedSigns={selectedSigns}
                            onSignChange={onSignChange}
                            readOnly={readOnly}
                            kind="default"
                          />
                        ))}
                      </div>
                      <div className="sign_groups--select_signs-zone_col-default">
                        {(['c', 'm'] as Zone[]).map((zone) => (
                          <ZoneSelector
                            key={`${station}-${zone}`}
                            config={station}
                            zone={zone}
                            line={line}
                            selectedSigns={selectedSigns}
                            onSignChange={onSignChange}
                            readOnly={readOnly}
                            kind="default"
                          />
                        ))}
                      </div>
                      <div className="sign_groups--select_signs-zone_col-default">
                        {(['e', 'n'] as Zone[]).map((zone) => (
                          <ZoneSelector
                            key={`${station}-${zone}`}
                            config={station}
                            zone={zone}
                            line={line}
                            selectedSigns={selectedSigns}
                            onSignChange={onSignChange}
                            readOnly={readOnly}
                            kind="default"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="sign_groups--select_signs-zone_col-named">
                      {(['n', 's', 'e', 'w', 'c', 'm'] as Zone[]).map(
                        (zone) => (
                          <ZoneSelector
                            key={`${station}-${zone}`}
                            config={station}
                            zone={zone}
                            line={line}
                            selectedSigns={selectedSigns}
                            onSignChange={onSignChange}
                            readOnly={readOnly}
                            kind="named"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sign_groups--container-right">
          <div>
            Set Custom Message
            <div className="sign_groups--custom_message-container">
              <div>
                <SignTextInput
                  signID="sign_group"
                  line1={line1}
                  line2={line2}
                  onValidLine1Change={setLine1}
                  onValidLine2Change={setLine2}
                />
              </div>
              <div className="sign_groups--virtual_sign">
                <VirtualSign line1={line1} line2={line2} time={currentTime} />
              </div>
            </div>
          </div>
          <div>
            Schedule return to &quot;Auto&quot;
            <div className="sign_groups--schedule-container">
              <div className="sign_groups--schedule-date">
                Date and time
                <div>
                  <ReactDatePicker
                    selected={expireAt}
                    onChange={onDatePickerChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMM d @ h:mm aa"
                    disabled={readOnly || expireAlertID !== ''}
                  />
                </div>
              </div>
              <div className="sign_groups--schedule-alert">
                Upon alert closing
                <div>
                  <AlertPicker
                    alertId={expireAlertID}
                    onChange={setExpireAlertID}
                    alerts={alerts}
                    disabled={
                      readOnly ||
                      expireAt !== null ||
                      Object.keys(alerts).length === 0
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sign_groups--apply-container">
            <input type="submit" value="Apply" className="btn btn-primary" />
          </div>
        </div>
      </div>
    </form>
  );
}

interface SignGroupsListProps {
  signGroups: RouteSignGroups;
  readOnly: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
}

function SignGroupsList({
  signGroups,
  readOnly,
  setIsFormOpen,
}: SignGroupsListProps): JSX.Element | null {
  const handleClick = React.useCallback(() => {
    setIsFormOpen(true);
  }, [setIsFormOpen]);

  return (
    <div>
      <div>Sign Groups: {JSON.stringify(signGroups)}</div>
      <button disabled={readOnly} onClick={handleClick} type="button">
        Create
      </button>
    </div>
  );
}

interface SignGroupsProps {
  line: string;
  currentTime: number;
  alerts: RouteAlerts;
  signGroups: RouteSignGroups;
  setSignGroup: (line: string, ts: number, signGroup: SignGroup) => void;
  readOnly: boolean;
}

function SignGroups({
  line,
  currentTime,
  alerts,
  signGroups,
  setSignGroup,
  readOnly,
}: SignGroupsProps): JSX.Element | null {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const setSignGroupAndClose = React.useCallback(
    (setLine: string, ts: number, signGroup: SignGroup) => {
      setIsFormOpen(false);
      setSignGroup(setLine, ts, signGroup);
    },
    [setSignGroup, setIsFormOpen],
  );

  if (isFormOpen) {
    return (
      <SignGroupsForm
        line={line}
        currentTime={currentTime}
        alerts={alerts}
        setSignGroup={setSignGroupAndClose}
        readOnly={readOnly}
      />
    );
  }
  return (
    <SignGroupsList
      signGroups={signGroups}
      readOnly={readOnly}
      setIsFormOpen={setIsFormOpen}
    />
  );
}

export default SignGroups;
