import React from 'react';
import SignText from './SignText';
import SignGroupExpirationDetails from './SignGroupExpirationDetails';
import { SignConfigs, SignGroup, StationConfig } from './types';
import { stationConfig, arincToRealtimeId } from './mbta';


function returnToAutoMode(
  setConfigFn: (x: SignConfigs) => void,
  stations: StationConfig[],
  line: string,
) {
  const statuses: {
    [key: string]: { mode: 'auto' | 'off' | 'headway'; expires?: null };
  } = {};

  stations.forEach((station: StationConfig) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
      const zoneConfig = station.zones[zone];
      if (zoneConfig!== undefined) {
        const { modes } = zoneConfig;
        if (realtimeId) {
          statuses[realtimeId] = { mode: 'auto', expires: null };
        }
      }
    }) 
  })

  setConfigFn(statuses);
}


interface SignGroupProps {
  currentTime: number;
  groupKey: string;
  group: SignGroup;
  readOnly: boolean;
  onEdit: (key: string) => void;
  setConfigs: (x: SignConfigs) => void;
}

export default function SignGroupItem({
  groupKey,
  currentTime,
  group,
  readOnly,
  onEdit,
}: SignGroupProps) {
  return (
    <div className="sign_groups--group-item" data-testid={groupKey}>
      <SignText time={currentTime} line1={group.line1} line2={group.line2} />
      <SignGroupExpirationDetails group={group} />
      <div className="sign_groups--group-buttons">
        <button
          disabled={readOnly}
          onClick={() => onEdit(groupKey)}
          type="button"
          className="btn btn-secondary sign_groups--group-edit-button"
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {returnToAutoMode(setConfigs, stations, line)}}
        >
          Return to "Auto"
        </button>
      </div>
    </div>
  );
}
