import * as React from 'react';
import SignText from './SignText';
import { SingleSignContent } from './types';
import { lineDisplayText } from './SignPanel';

interface SingleSignProps {
  signContent: SingleSignContent;
}

function SingleSign({ signContent }: SingleSignProps): JSX.Element {
  const [initialTime] = React.useState(Date.now());
  const [currentTime, setTime] = React.useState(Date.now());

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
          signContent.lines['1'],
          currentTime,
          initialTime,
        )}
        line2={lineDisplayText(
          signContent.lines['2'],
          currentTime,
          initialTime,
        )}
        time={currentTime}
      />
    </div>
  );
}

export default SingleSign;
