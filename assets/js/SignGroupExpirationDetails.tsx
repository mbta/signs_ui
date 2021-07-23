import React from 'react';
import dateFormat from 'dateformat';
import { SignGroup } from './types';

export default function SignGroupExpirationDetails({
  group,
}: {
  group: SignGroup;
}): JSX.Element {
  const expirationText = React.useMemo(() => {
    let text;
    if (group.expires) {
      const format = 'mm/dd/yyyy hh:MM TT';
      text = `at ${dateFormat(new Date(group.expires), format)}`;
    } else if (group.alert_id) {
      text = `when alert ${group.alert_id} closes`;
    } else {
      text = 'manually';
    }
    return text;
  }, [group]);

  return (
    <div>
      Scheduled return to auto:
      <div className="sign_groups--group-expiration">{expirationText}</div>
    </div>
  );
}
