import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import { stationConfig, arincToRealtimeId } from './mbta';
import SignText from './SignText';
import SignTextInput from './SignTextInput';
import AlertPicker from './AlertPicker';
import ModalPrompt from './ModalPrompt';
import {
  RouteAlerts,
  StationConfig,
  Zone,
  RouteSignGroups,
  SignGroup,
} from './types';
import { defaultZoneLabel } from './helpers';
import SignGroupItem from './SignGroupItem';

function changeGroupSignText([station, zone]: [string, Zone], line: string) {
  const stationConfigs = stationConfig[line]?.stations || [];
  const config = stationConfigs.find((s) => s.id === station);
  const stationName = config?.name;
  const zoneLabel =
    config?.zones[zone]?.label || defaultZoneLabel(zone as Zone);

  return (
    <div>
      <p>
        The{' '}
        <span className="sign_groups--prompt-station">{`${stationName} ${zoneLabel}`}</span>{' '}
        sign is part of an active sign group.
      </p>
      <p>
        Would you like to remove it from its current group and reassign it to
        this one?
      </p>
    </div>
  );
}

interface ZoneSelectorProps {
  config: StationConfig;
  zone: Zone;
  line: string;
  selectedSigns: Set<string>;
  onSignChange: ([stationId, zone]: [string, Zone], selected: boolean) => void;
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
          onChange={(evt) =>
            onSignChange([config.id, zone], evt.target.checked)
          }
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
  signGroups: RouteSignGroups;
  signGroupKey: string | null;
  initialSignGroup: SignGroup;
  onApply: (key: string | null, signGroup: SignGroup) => void;
  onCancel: () => void;
}

function SignGroupsForm({
  line,
  currentTime,
  alerts,
  signGroups,
  signGroupKey,
  initialSignGroup,
  onApply,
  onCancel,
}: SignGroupsFormProps): JSX.Element | null {
  const signIdsInOtherGroups = React.useMemo(() => {
    const signIds = new Set();
    Object.entries(signGroups).forEach(([key, signGroup]) => {
      if (key !== signGroupKey) {
        signGroup.sign_ids.forEach((id) => signIds.add(id));
      }
    });
    return signIds;
  }, [signGroupKey, signGroups]);

  const [signGroup, setSignGroup] = React.useState(initialSignGroup);
  const [arincSignChangingGroup, setArincSignChangingGroup] = React.useState<
    null | [string, Zone]
  >(null);

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
    ([stationId, zone]: [string, Zone], isChecked: boolean) => {
      const newSignIds = new Set(signIds);
      const signId = arincToRealtimeId(`${stationId}-${zone}`, line);
      if (isChecked) {
        if (signIdsInOtherGroups.has(signId)) {
          setArincSignChangingGroup([stationId, zone]);
        } else {
          newSignIds.add(signId);
          setSignGroup({ ...signGroup, sign_ids: Array.from(newSignIds) });
        }
      } else {
        newSignIds.delete(signId);
        setSignGroup({ ...signGroup, sign_ids: Array.from(newSignIds) });
      }
    },
    [signGroup, setSignGroup, setArincSignChangingGroup, signIdsInOtherGroups],
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
      {arincSignChangingGroup && (
        <ModalPrompt
          acceptText="Yes, reassign this sign"
          contents={changeGroupSignText(arincSignChangingGroup, line)}
          elementId="tab-panel-container"
          onAccept={() => {
            const [station, zone] = arincSignChangingGroup;
            const signId = arincToRealtimeId(`${station}-${zone}`, line);
            const newSignIds = new Set(signIds).add(signId);
            setSignGroup({ ...signGroup, sign_ids: Array.from(newSignIds) });
            setArincSignChangingGroup(null);
          }}
          onCancel={() => {
            setArincSignChangingGroup(null);
          }}
        />
      )}
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
  currentTime: number;
  onCreate: () => void;
  onEdit: (groupKey: string) => void;
}

function SignGroupsList({
  signGroups,
  readOnly,
  currentTime,
  onCreate,
  onEdit,
}: SignGroupsListProps): JSX.Element | null {
  const groupCount = Object.keys(signGroups).length;

  return (
    <div className="sign_groups--groups-container">
      <button
        className="btn btn-primary"
        disabled={readOnly}
        onClick={onCreate}
        type="button"
      >
        Create
      </button>
      <div className="sign_groups--group-list-container">
        {groupCount > 0 && <h6>Active Groups</h6>}
        <div className="sign_groups--group-list">
          {Object.keys(signGroups).map((groupKey) => (
            <SignGroupItem
              key={groupKey}
              currentTime={currentTime}
              groupKey={groupKey}
              group={signGroups[groupKey]}
              readOnly={readOnly}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SignGroupsProps {
  line: string;
  currentTime: number;
  alerts: RouteAlerts;
  signGroups: RouteSignGroups;
  setSignGroups: (line: string, signGroups: RouteSignGroups) => void;
  readOnly: boolean;
}

function SignGroups({
  line,
  currentTime,
  alerts,
  signGroups,
  setSignGroups,
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

  const openForm = React.useCallback(
    (groupKey: string | null) => {
      setFormKey(groupKey);
      setFormSignGroup(groupKey ? signGroups[groupKey] : newSignGroup);
      setIsFormOpen(true);
    },
    [signGroups],
  );

  const setSignGroupAndCloseForm = React.useCallback(
    (groupKey: string | null, signGroup: SignGroup) => {
      setIsFormOpen(false);
      const key = groupKey || currentTime.toString();
      setSignGroups(line, { [key]: signGroup });
    },
    [line, currentTime, setSignGroups, setIsFormOpen],
  );

  if (isFormOpen) {
    return (
      <SignGroupsForm
        line={line}
        currentTime={currentTime}
        alerts={alerts}
        signGroups={signGroups}
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
      currentTime={currentTime}
      readOnly={readOnly}
      onCreate={() => openForm(null)}
      onEdit={openForm}
    />
  );
}

export default SignGroups;
