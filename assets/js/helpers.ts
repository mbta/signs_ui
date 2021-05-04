import { RouteAlerts, Alerts } from './types';

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
    if (excessTime <= pages[i].duration) {
      return pages[i].content;
    }
    excessTime -= pages[i].duration;
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

/* eslint-disable import/prefer-default-export */
export { choosePage, alertsForLine };
