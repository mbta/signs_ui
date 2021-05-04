import { choosePage, alertsForLine } from '../js/helpers';

test('choosePage returns the first page when there is only one', () => {
  const pages = [{ content: 'the page', duration: 5 }];

  expect(choosePage(pages, 2)).toEqual('the page');
  expect(choosePage(pages, 7)).toEqual('the page');
});

test('choosePage cycles through pages as time elapses', () => {
  const pages = [
    { content: 'page one', duration: 2 },
    { content: 'page two', duration: 5 },
    { content: 'page three', duration: 2 },
  ];

  expect(choosePage(pages, 1.5)).toEqual('page one');
  expect(choosePage(pages, 2.5)).toEqual('page two');
  expect(choosePage(pages, 3.5)).toEqual('page two');
  expect(choosePage(pages, 4.5)).toEqual('page two');
  expect(choosePage(pages, 5.5)).toEqual('page two');
  expect(choosePage(pages, 6.5)).toEqual('page two');
  expect(choosePage(pages, 7.5)).toEqual('page three');
  expect(choosePage(pages, 8.5)).toEqual('page three');
  expect(choosePage(pages, 9.5)).toEqual('page one');
  expect(choosePage(pages, 10.5)).toEqual('page one');
  expect(choosePage(pages, 100.5)).toEqual('page one');
});

function makeAlert(id: string) {
  return { id, created_at: null, service_effect: 'something is wrong' };
}

test('alertsForLine returns alerts that are present for a line', () => {
  const alerts = { Red: { '1234': makeAlert('1234') } };
  expect(alertsForLine(alerts, 'Red')).toEqual({ '1234': makeAlert('1234') });
});

test('alertsForLine returns empty object for a line with no alerts', () => {
  const alerts = {};
  expect(alertsForLine(alerts, 'Red')).toEqual({});
});

test('alertsForLine combines alerts across Green branches', () => {
  const alerts = {
    'Green-B': { '123': makeAlert('123') },
    'Green-C': { '456': makeAlert('456') },
  };
  expect(alertsForLine(alerts, 'Green')).toEqual({
    '123': makeAlert('123'),
    '456': makeAlert('456'),
  });
});

test('alertsForLine returns empty object for unknown line', () => {
  const alerts = {};
  expect(alertsForLine(alerts, 'Unknown')).toEqual({});
});
