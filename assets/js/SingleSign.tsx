import * as React from 'react';
import { Socket } from 'phoenix';
import SignText from './SignText';
import { SingleSignContent } from './types';
import { lineDisplayText } from './SignPanel';

interface SingleSignProps {
  signContent: SingleSignContent;
}

function SingleSign({ signContent }: SingleSignProps): JSX.Element {
  const [initialTime] = React.useState(Date.now());
  const [currentTime, setTime] = React.useState(Date.now());
  const [currentSignContent, setSignContent] = React.useState(signContent);

  React.useEffect(() => {
    const socket = new Socket('/socket/sign', {
      params: { sign_id: signContent.sign_id },
    });
    socket.connect();
    const signsChannel = socket.channel('signs:single', {});
    signsChannel.join().receive('ok', () => true);
    signsChannel.on(
      `sign_update:${signContent.sign_id}`,
      (sign: SingleSignContent) => {
        if (sign.sign_id === signContent.sign_id) {
          setSignContent(sign);
        }
      },
    );

    return () => {
      signsChannel.leave();
    };
  }, []);

  function updateTime() {
    setTime(Date.now());
  }

  React.useEffect(() => {
    const timerId = setInterval(updateTime, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="single_sign--sign_text">
      <SignText
        line1={lineDisplayText(
          currentSignContent.lines['1'],
          currentTime,
          initialTime,
        )}
        line2={lineDisplayText(
          currentSignContent.lines['2'],
          currentTime,
          initialTime,
        )}
        time={currentTime}
      />
    </div>
  );
}

export default SingleSign;
