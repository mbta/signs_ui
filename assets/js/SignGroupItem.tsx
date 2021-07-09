import dateFormat from 'dateformat';
import React from 'react';
import SignText from './SignText';
import { SignGroup } from './types';

interface SignGroupProps {
  currentTime: number;
  groupKey: string;
  group: SignGroup;
  readOnly: boolean;
  onEdit: (key: string) => void;
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
      <div className="sign_group--expiration-container">
        Scheduled return to auto:
        {group.expires ? (
          <div className="sign_groups--group-expiration">
            at {dateFormat(new Date(group.expires), 'mm/dd/yyyy hh:MM TT')}
          </div>
        ) : group.alert_id ? (
          <div className="sign_groups--group-expiration">
            when alert {group.alert_id} closes
          </div>
        ) : (
          <div className="sign_groups--group-expiration">manually</div>
        )}
      </div>
      <div className="sign_groups--group-buttons">
        <button
          disabled={readOnly}
          onClick={() => onEdit(groupKey)}
          type="button"
          className="btn btn-secondary sign_groups--group-edit-button"
        >
          Edit
        </button>
        <button type="button" className="btn btn-primary">
          Return to "Auto"
        </button>
      </div>
    </div>
  );
}
