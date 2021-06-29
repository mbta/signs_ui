import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import { stationConfig, arincToRealtimeId } from './mbta';
import SignText from './SignText';
import SignTextInput from './SignTextInput';
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
  selectedSigns: Set<string>;
  onSignChange: (signId: string, selected: boolean) => void;
  kind: 'default' | 'named';
}

function ZoneSelector({
  config,
  zone,
  line,
  selectedSigns,
  onSignChange,
  kind,
}: ZoneSelectorProps): JSX.Element | null {
  const handleChange = React.useCallback(
    (evt) => onSignChange(evt.target.name, evt.target.checked),
    [onSignChange],
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
  const isSelected = selectedSigns.has(signId);

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
          data-testid={signId}
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
  signGroupKey: string | null;
  initialSignGroup: SignGroup;
  onApply: (key: string | null, signGroup: SignGroup) => void;
  onCancel: () => void;
}

function SignGroupsForm({
  line,
  currentTime,
  alerts,
  signGroupKey,
  initialSignGroup,
  onApply,
  onCancel,
}: SignGroupsFormProps): JSX.Element | null {
  const [signGroup, setSignGroup] = React.useState(initialSignGroup);

  const expires = React.useMemo(
    () => (signGroup.expires ? new Date(signGroup.expires) : null),
    [signGroup],
  );
  const signIds = React.useMemo(() => new Set(signGroup.sign_ids), [signGroup]);

  const onDatePickerChange = React.useCallback(
    (date: Date | null) => {
      setSignGroup({ ...signGroup, expires: date ? date.toISOString() : null });
    },
    [signGroup, setSignGroup],
  );

  const onSignChange = React.useCallback(
    (signId: string, isChecked: boolean) => {
      const newSignIds = new Set(signIds);
      if (isChecked) {
        newSignIds.add(signId);
      } else {
        newSignIds.delete(signId);
      }
      setSignGroup({ ...signGroup, sign_ids: Array.from(newSignIds) });
    },
    [signGroup, setSignGroup],
  );

  const onSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      onApply(signGroupKey, signGroup);
    },
    [signGroup, signGroupKey],
  );

  const stations = stationConfig[line]?.stations ?? [];
  const submitText = signGroupKey === null ? 'Create group' : 'Apply changes';
  const canSubmit =
    signGroup !== initialSignGroup && signGroup.sign_ids.length > 0;

  return (
    <form onSubmit={onSubmit}>
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
                            selectedSigns={signIds}
                            onSignChange={onSignChange}
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
                            selectedSigns={signIds}
                            onSignChange={onSignChange}
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
                            selectedSigns={signIds}
                            onSignChange={onSignChange}
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
                            selectedSigns={signIds}
                            onSignChange={onSignChange}
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
                  line1={signGroup.line1}
                  line2={signGroup.line2}
                  onValidLine1Change={(line1) =>
                    setSignGroup({ ...signGroup, line1 })
                  }
                  onValidLine2Change={(line2) =>
                    setSignGroup({ ...signGroup, line2 })
                  }
                />
              </div>
              <div>
                <SignText
                  line1={signGroup.line1}
                  line2={signGroup.line2}
                  time={currentTime}
                />
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
                    selected={expires}
                    onChange={onDatePickerChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMM d @ h:mm aa"
                    disabled={signGroup.alert_id !== null}
                  />
                </div>
              </div>
              <div className="sign_groups--schedule-alert">
                Upon alert closing
                <div>
                  <AlertPicker
                    alertId={signGroup.alert_id || ''}
                    onChange={(id) =>
                      setSignGroup({ ...signGroup, alert_id: id })
                    }
                    alerts={alerts}
                    disabled={
                      expires !== null || Object.keys(alerts).length === 0
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sign_groups--buttons-container">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <input
              type="submit"
              disabled={!canSubmit}
              value={submitText}
              className="btn btn-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

interface SignGroupsListProps {
  signGroups: RouteSignGroups;
  readOnly: boolean;
  onCreate: () => void;
  onEdit: (timestamp: string) => void;
}

function SignGroupsList({
  signGroups,
  readOnly,
  onCreate,
  onEdit,
}: SignGroupsListProps): JSX.Element | null {
  return (
    <div>
      {Object.keys(signGroups).map((timestamp) => (
        <p key={timestamp}>
          <button
            disabled={readOnly}
            onClick={() => onEdit(timestamp)}
            type="button"
          >
            Edit
          </button>
          {timestamp}: {JSON.stringify(signGroups[timestamp])}
        </p>
      ))}
      <button disabled={readOnly} onClick={onCreate} type="button">
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
  setSignGroup: (line: string, timestamp: number, signGroup: SignGroup) => void;
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
  const newSignGroup: SignGroup = {
    sign_ids: [],
    line1: '',
    line2: '',
    expires: null,
    alert_id: null,
  };
  const [formKey, setFormKey] = React.useState<string | null>(null);
  const [formSignGroup, setFormSignGroup] = React.useState(newSignGroup);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const openEditForm = React.useCallback(
    (timestamp: string) => {
      setFormKey(timestamp);
      setFormSignGroup(signGroups[timestamp]);
      setIsFormOpen(true);
    },
    [signGroups],
  );

  const setSignGroupAndCloseForm = React.useCallback(
    (key: string | null, signGroup: SignGroup) => {
      setIsFormOpen(false);
      const timestamp = key === null ? currentTime : parseInt(key, 10);
      setSignGroup(line, timestamp, signGroup);
    },
    [line, currentTime, setSignGroup, setIsFormOpen],
  );

  if (isFormOpen) {
    return (
      <SignGroupsForm
        line={line}
        currentTime={currentTime}
        alerts={alerts}
        signGroupKey={formKey}
        initialSignGroup={formSignGroup}
        onApply={setSignGroupAndCloseForm}
        onCancel={() => setIsFormOpen(false)}
      />
    );
  }
  return (
    <SignGroupsList
      signGroups={signGroups}
      readOnly={readOnly}
      onCreate={() => setIsFormOpen(true)}
      onEdit={openEditForm}
    />
  );
}

export default SignGroups;
