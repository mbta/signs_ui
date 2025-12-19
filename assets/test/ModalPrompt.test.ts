import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalPrompt from '../js/ModalPrompt';

test('can accept or cancel the prompt', async () => {
  const user = userEvent.setup();
  let isAccepted = false;

  render(
    React.createElement(ModalPrompt, {
      acceptText: 'Yes, accept',
      onAccept: () => {
        isAccepted = true;
      },
      onCancel: () => {
        isAccepted = false;
      },
      contents: React.createElement(
        'p',
        {},
        'This is a prompt. Would you like to accept?',
      ),
    }),
  );

  await user.click(screen.getByRole('button', { name: 'Yes, accept' }));
  expect(isAccepted).toBe(true);

  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(isAccepted).toBe(false);
});
