import * as React from 'react';
import SignText from './SignText';
import { SingleSignContent } from './types';
import { lineDisplayText } from './helpers';

interface SignDisplayProps {
  content: SingleSignContent;
  currentTime: number;
}

type Event = {
  timestamp: number;
  value: { top: string; bottom: string; duration: number } | null;
};

function SignDisplay({ currentTime, content }: SignDisplayProps) {
  const [initialTime] = React.useState(currentTime);

  // Compute a time-sequence of page transitions from recent audio-visual
  // messages, and find which one we should be on.
  const currentPage = content.audios
    .filter((audio) => audio.visual_data)
    .reduce<Event[]>(
      (events, audio) => {
        const startTimestamp = Math.max(
          events.at(-1)?.timestamp ?? 0,
          audio.timestamp,
        );
        const [newEvents, newTimestamp] = audio.visual_data.pages.reduce<
          [Event[], number]
        >(
          ([innerEvents, timestamp], page) => [
            [...innerEvents, { timestamp, value: page }],
            timestamp + page.duration * 1000,
          ],
          [events, startTimestamp],
        );
        return [...newEvents, { timestamp: newTimestamp, value: null }];
      },
      [{ timestamp: 0, value: null }],
    )
    .findLast((event) => event.timestamp < currentTime)?.value;

  const [line1, line2] = currentPage
    ? [currentPage.top, currentPage.bottom]
    : [
        lineDisplayText(content.lines['1'], currentTime, initialTime),
        lineDisplayText(content.lines['2'], currentTime, initialTime),
      ];
  return (
    <SignText
      line1={line1}
      line2={line2}
      time={currentTime}
      announcement={!!currentPage}
    />
  );
}

export default SignDisplay;
