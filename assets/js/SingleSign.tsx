import * as React from 'react';
import { Socket } from 'phoenix';
import { SingleSignContent } from './types';
import SignDisplay from './SignDisplay';

interface SingleSignProps {
  signContent: SingleSignContent;
}

function SingleSign({ signContent }: SingleSignProps): JSX.Element {
  const [currentTime, setTime] = React.useState(Date.now());
  const [serverTimeOffset, setServerTimeOffset] = React.useState(0);
  const [currentSignContent, setSignContent] = React.useState(signContent);

  React.useEffect(() => {
    const socket = new Socket('/socket/sign', {
      params: { sign_id: signContent.sign_id },
    });
    socket.connect();
    const signsChannel = socket.channel(`sign:${signContent.sign_id}`, {});
    const timeChannel = socket.channel('time:all', {});
    [signsChannel, timeChannel].forEach((channel) =>
      channel.join().receive('ok', () => true),
    );

    timeChannel.on('current_time', ({ value }) => {
      setServerTimeOffset(value - Date.now());
    });

    signsChannel.on(`sign_update`, (sign: SingleSignContent) => {
      if (sign.sign_id === signContent.sign_id) {
        setSignContent(sign);
      }
    });

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
      <SignDisplay
        content={currentSignContent}
        currentTime={currentTime + serverTimeOffset}
        short={signContent.sign_id.startsWith('SCOU-')}
      />
    </div>
  );
}

export default SingleSign;
