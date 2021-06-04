import * as React from 'react';
import dateFormat from 'dateformat';

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
}

function SignText({ time, line1, line2 }: SignTextProps): JSX.Element | null {
  return (
    <div className="sign_text--container">
      <div className="sign_text--line">{padToClock(line1, time)}</div>
      <div className="sign_text--line">{line2}</div>
    </div>
  );
}

export default SignText;
