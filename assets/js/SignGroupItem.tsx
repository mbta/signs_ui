import React from 'react';
import SignText from './SignText';
import SignGroupExpirationDetails from './SignGroupExpirationDetails';
import { SignConfigs, SignGroup, StationConfig } from './types';
import { stationConfig, arincToRealtimeId } from './mbta';


interface SignGroupProps {
  currentTime: number;
  groupKey: string;
  group: SignGroup;
  readOnly: boolean;
  onEdit: (key: string) => void;
  setConfigs: (x: SignConfigs) => void;
  stationConfigs?: StationConfig[];
  line: string;
  setSignGroup: (line: string, key: string, signGroup: SignGroup) => void;
}

function returnToAutoMode(
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

  return (
    <button
      className="mr-2"
      id="apply"
      type="submit"
      onClick={() => alert("Are you sure?")}
    >
      Return to "Auto"
    </button>
  );
}

export default function SignGroupItem({
  groupKey,
  currentTime,
  group,
  readOnly,
  onEdit,
  setConfigs,
  stationConfigs,
  line,
}: SignGroupProps) {
  const stations: StationConfig[] =
    stationConfigs ||
    (stationConfig[line] && stationConfig[line].stations) ||
    [];
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
      </div>
    </div>
  );
}

export {
  returnToAutoMode,
  SignGroupItem,
  SignGroupProps,
};
