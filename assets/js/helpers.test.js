import { updateSigns } from './helpers';

test('updateSigns returns a new map with changed values for the ID', () => {
  const oldSigns = { id1: ['one', 'two'] };
  const newSigns = updateSigns(oldSigns, {
    signId: 'id1', lineNumber: 2, duration: 2, content: 'TWO',
  });
  expect(oldSigns).toEqual({ id1: ['one', 'two'] });
  expect(newSigns).toEqual({ id1: ['one', { duration: 2, text: 'TWO' }] });
});

test('updateSigns returns a new map adding a new sign if not present before', () => {
  const signs = updateSigns({}, {
    signId: 'newSign', lineNumber: 1, duration: 2, content: 'ONE',
  });
  expect(signs).toEqual({ newSign: [{ duration: 2, text: 'ONE' }, { duration: '0', text: '' }] });
});
