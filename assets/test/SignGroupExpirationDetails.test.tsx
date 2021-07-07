import * as React from 'react';
import { render, screen } from '@testing-library/react';
import SignGroupExpirationDetails from '../js/SignGroupExpirationDetails';
import { SignGroup } from '../js/types';

function renderComponent(group: SignGroup) {
  render(<SignGroupExpirationDetails group={group} />);
}

function componentNode() {
  return screen.getByText('Scheduled return to auto:', { exact: false });
}

test('shows the sign group expiration date if one is configured', () => {
  renderComponent({
    sign_ids: ['id'],
    line1: 'custom',
    line2: 'text',
    expires: '2021-01-01T23:00:00Z',
    alert_id: null,
  });

  expect(componentNode()).toHaveTextContent('at 01/01/2021 06:00 PM');
});

test('shows the sign group alert ID if one is configured', () => {
  renderComponent({
    sign_ids: ['id'],
    line1: 'custom',
    line2: 'text',
    expires: null,
    alert_id: '456123',
  });

  expect(componentNode()).toHaveTextContent('when alert 456123 closes');
});

test('shows "manually" if the group has neither alert ID nor date', () => {
  renderComponent({
    sign_ids: ['id'],
    line1: 'custom',
    line2: 'text',
    expires: null,
    alert_id: null,
  });

  expect(componentNode()).toHaveTextContent('manually');
});
