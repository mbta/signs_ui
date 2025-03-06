import { RouteAlerts, Alerts, Zone } from './types';

function choosePage(
  pages: { content: string; duration: number }[],
  elapsedSeconds: number,
): string {
  if (pages.length === 1) {
    return pages[0].content;
  }

  const repeatTime = pages.reduce((acc, pg) => acc + pg.duration, 0);
  let excessTime = elapsedSeconds % repeatTime;

  for (let i = 0; i < pages.length; i += 1) {
    if (excessTime < pages[i].duration) {
      return pages[i].content;
    }
    excessTime -= pages[i].duration;
  }

  return '';
}

function isNotExpired(expiration: string, currentTime: number) {
  return Date.parse(expiration) - currentTime > 0;
}

function lineDisplayText(
  lineContent:
    | {
        text: {
          content: string;
          duration: number;
        }[];
        expiration: string;
      }
    | undefined,
  currentTime: number,
  initialTime: number,
): string {
  if (
    lineContent !== undefined &&
    isNotExpired(lineContent.expiration, currentTime)
  ) {
    // ARINC signs start paging on the second page, so we rearrange the content to emulate that behavior
    return choosePage(
      [...lineContent.text.slice(1), ...lineContent.text.slice(0, 1)],
      Math.round((currentTime - initialTime) / 1000),
    );
  }
  return '';
}

function alertsForLine(alerts: Alerts, line: string): RouteAlerts {
  if (['Red', 'Orange', 'Blue', 'Mattapan'].includes(line)) {
    return alerts[line] || {};
  }
  if (line === 'Green') {
    return {
      ...(alerts['Green-B'] || {}),
      ...(alerts['Green-C'] || {}),
      ...(alerts['Green-D'] || {}),
      ...(alerts['Green-E'] || {}),
    };
  }
  return {};
}

function formatTime(dtIso8601: string | null): string {
  if (dtIso8601 === null) {
    return '';
  }

  const dt = new Date(dtIso8601);

  const today = new Date();
  let datePart;
  let timePart;

  if (
    dt.getFullYear() === today.getFullYear() &&
    dt.getMonth() === today.getMonth() &&
    dt.getDate() === today.getDate()
  ) {
    datePart = 'today';
  } else {
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][dt.getMonth()];
    datePart = `${month} ${dt.getDate()}`;
  }

  const minutes =
    dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes().toString();

  if (dt.getHours() === 0) {
    timePart = `12:${minutes} AM`;
  } else if (dt.getHours() < 12) {
    timePart = `${dt.getHours()}:${minutes} AM`;
  } else if (dt.getHours() === 12) {
    timePart = `12:${minutes} PM`;
  } else {
    timePart = `${dt.getHours() - 12}:${minutes} PM`;
  }

  return `${datePart} @ ${timePart}`;
}

function defaultZoneLabel(z: Zone): string {
  switch (z) {
    case 'c':
      return 'CP';
    case 'e':
      return 'EB';
    case 'm':
      return 'MZ';
    case 'n':
      return 'NB';
    case 's':
      return 'SB';
    case 'w':
      return 'WB';
  }
}

function arincToRealtimeId(stationZone: string): string {
  return window.arincToRealtimeIdMap[stationZone];
}

export {
  choosePage,
  lineDisplayText,
  alertsForLine,
  formatTime,
  defaultZoneLabel,
  arincToRealtimeId,
};
