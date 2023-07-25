import React from 'react';
import SignText from './SignText';
import SignGroupExpirationDetails from './SignGroupExpirationDetails';
import { RouteSignGroupsWithDeletions, SignGroup } from './types';

interface SignGroupProps {
  currentTime: number;
  groupKey: string;
  group: SignGroup;
  line: string;
  setSignGroups: (
    line: string,
    signGroups: RouteSignGroupsWithDeletions,
  ) => void;
  readOnly: boolean;
  onEdit: (key: string) => void;
}

export default function SignGroupItem({
  groupKey,
  currentTime,
  group,
  line,
  setSignGroups,
  readOnly,
  onEdit,
}: SignGroupProps): JSX.Element {
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
          disabled={readOnly}
          onClick={() => setSignGroups(line, { [groupKey]: {} })}
          type="button"
          className="btn btn-primary"
        >
          Return to &ldquo;Auto&rdquo;
        </button>
      </div>
    </div>
  );
}
