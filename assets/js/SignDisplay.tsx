import * as React from 'react';
import SignText from './SignText';
import { SingleSignContent, Audio } from './types';
import { lineDisplayText } from './helpers';

interface SignDisplayProps {
  content: SingleSignContent;
  currentTime: number;
  short?: boolean;
}

type VisualEvent = {
  timestamp: number;
  value: { top: string; bottom: string; duration: number } | null;
};

function SignDisplay({ currentTime, content, short }: SignDisplayProps) {
  const [initialTime] = React.useState(currentTime);

  const sequenceAudio = (audio: Audio, startTimestamp: number) => {
    const [newEvents, endTimestamp] = audio.visual_data.pages.reduce<
      [VisualEvent[], number]
    >(
      ([events, timestamp], page) => [
        [...events, { timestamp, value: page }],
        timestamp + page.duration * 1000,
      ],
      [[], startTimestamp],
    );
    return [...newEvents, { timestamp: endTimestamp, value: null }];
  };

  // Compute a time-sequence of page transitions from recent audio-visual
  // messages, and find which one we should be on.
  const currentPage = content.audios
    .filter((audio) => audio.visual_data)
    .reduce<VisualEvent[]>(
      (events, audio) => {
        const startTimestamp = Math.max(
          events.at(-1)?.timestamp ?? 0,
          audio.timestamp,
        );
        const newEvents = sequenceAudio(audio, startTimestamp);
        return [...events, ...newEvents];
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
      short={short}
    />
  );
}

export default SignDisplay;
