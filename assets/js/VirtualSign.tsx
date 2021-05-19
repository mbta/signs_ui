import * as React from 'react';
import dateFormat from 'dateformat';

function timeString(currentTime: number) {
  const date = new Date(currentTime);
  return dateFormat(date, 'h:MM').padStart(5);
}

function padToClock(text: string, currentTime: number): string {
  return `${text.padEnd(19)}${timeString(currentTime)}`;
}

interface VirtualSignProps {
  time: number;
  line1: string;
  line2: string;
}

function VirtualSign({
  time,
  line1,
  line2,
}: VirtualSignProps): JSX.Element | null {
  return (
    <div className="virtual_sign--container">
      <div className="virtual_sign--line">{padToClock(line1, time)}</div>
      <div className="virtual_sign--line">{line2}</div>
    </div>
  );
}

export default VirtualSign;
