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

export default function SignGroupItem({
  groupKey,
  currentTime,
  group,
  readOnly,
  onEdit,
  setSignGroup,
  stationConfigs,
  line,
}: 
  SignGroupProps) {
  const stations: StationConfig[] =
    stationConfigs ||
    (stationConfig[line] && stationConfig[line].stations) ||
    [];
  const newSignGroup: SignGroup = {
    sign_ids: [],
    line1: '',
    line2: '',
    expires: null,
    alert_id: null,
  };
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
        onClick={(group) => {
          confirm("Are you sure?");
          setSignGroup(line, groupKey, {});}}>
          Return to "Auto"
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
