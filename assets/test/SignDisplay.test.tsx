import * as React from 'react';
import { render, screen } from '@testing-library/react';
import SignDisplay from '../js/SignDisplay';

const expiration = new Date(20000).toISOString();

const content = {
  sign_id: 'x',
  lines: {
    1: { text: [{ content: 'Prediction', duration: 3 }], expiration },
    2: { text: [{ content: '', duration: 3 }], expiration },
  },
  audios: [
    {
      timestamp: 1000,
      visual_data: {
        pages: [
          { top: 'Message A-1', bottom: '', duration: 3 },
          { top: 'Message A-2', bottom: '', duration: 3 },
        ],
      },
    },
    {
      timestamp: 2000,
      visual_data: {
        pages: [{ top: 'Message B', bottom: '', duration: 3 }],
      },
    },
    {
      timestamp: 15000,
      visual_data: {
        pages: [{ top: 'Message C', bottom: '', duration: 3 }],
      },
    },
  ],
};

describe('SignDisplay', () => {
  test('Before', async () => {
    render(<SignDisplay content={content} currentTime={0} />);
    expect(screen.getByText(/Prediction/)).toBeTruthy();
  });

  test('Message A-1', async () => {
    render(<SignDisplay content={content} currentTime={1001} />);
    expect(screen.getByText(/Message A-1/)).toBeTruthy();
  });

  test('Message A-2', async () => {
    render(<SignDisplay content={content} currentTime={4001} />);
    expect(screen.getByText(/Message A-2/)).toBeTruthy();
  });

  test('Message B', async () => {
    render(<SignDisplay content={content} currentTime={7001} />);
    expect(screen.getByText(/Message B/)).toBeTruthy();
  });

  test('Between', async () => {
    render(<SignDisplay content={content} currentTime={10001} />);
    expect(screen.getByText(/Prediction/)).toBeTruthy();
  });

  test('Message C', async () => {
    render(<SignDisplay content={content} currentTime={15001} />);
    expect(screen.getByText(/Message C/)).toBeTruthy();
  });

  test('After', async () => {
    render(<SignDisplay content={content} currentTime={18001} />);
    expect(screen.getByText(/Prediction/)).toBeTruthy();
  });

  test('Expired', async () => {
    render(<SignDisplay content={content} currentTime={20001} />);
    expect(screen.queryByText(/Prediction/)).toBeFalsy();
  });
});
