import { choosePage } from './helpers';

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
