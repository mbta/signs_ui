import * as React from 'react';
import dateFormat from 'dateformat';
import cx from 'classnames';

function timeString(currentTime: number) {
  const date = new Date(currentTime);
  return dateFormat(date, 'h:MM').padStart(5);
}

function padToClock(text: string, currentTime: number): string {
  return `${text.padEnd(19)}${timeString(currentTime)}`;
}

interface SignTextProps {
  time: number;
  line1: string;
  line2: string;
  announcement?: boolean;
  short?: boolean;
}

function SignText({
  time,
  line1,
  line2,
  announcement,
  short,
}: SignTextProps): JSX.Element | null {
  return (
    <div className="sign_text--container">
      {short && !announcement && <span className="sign_text--divider" />}
      <div className={cx('sign_text--line', { centered: !!announcement })}>
        {announcement ? line1 : padToClock(line1, time)}
      </div>
      <div className={cx('sign_text--line', { centered: !!announcement })}>
        {line2}
      </div>
    </div>
  );
}

export default SignText;
