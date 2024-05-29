import * as React from 'react';

function isValidText(text: string) {
  return !/[^a-zA-Z0-9,/!@()': +]/.test(text);
}

interface SignTextInputProps {
  signID: string;
  line1: string;
  line2: string;
  onValidLine1Change: (line1: string) => void;
  onValidLine2Change: (line2: string) => void;
}

function SignTextInput({
  signID,
  line1,
  line2,
  onValidLine1Change,
  onValidLine2Change,
}: SignTextInputProps): JSX.Element | null {
  const [showTipText, setShowTipText] = React.useState(false);

  const handleInput = (
    evt: React.FormEvent<HTMLInputElement>,
    onValid: (line: string) => void,
  ): void => {
    const text = evt.currentTarget.value;

    if (isValidText(text)) {
      setShowTipText(false);
      onValid(text);
    } else {
      setShowTipText(true);
    }
  };

  const shorterWidthSigns = [
    'amory_st_eastbound',
    'amory_st_westbound',
    'babcock_st_eastbound',
    'babcock_st_westbound',
  ];

  const maxLengthLine1 = shorterWidthSigns.includes(signID) ? 16 : 18;
  const maxLengthLine2 = shorterWidthSigns.includes(signID) ? 16 : 24;

  return (
    <div>
      {showTipText && (
        <small className="custom_text_input--error-text">
          You may use letters, numbers, and: /,!@():&quot;
        </small>
      )}
      <div>
        <input
          id={`${signID}-line1-input`}
          className="custom_text_input--line-input"
          type="text"
          maxLength={maxLengthLine1}
          size={maxLengthLine1}
          value={line1}
          onChange={(evt) => handleInput(evt, onValidLine1Change)}
          alt="Line one custom text input"
        />
      </div>
      <div>
        <input
          id={`${signID}-line2-input`}
          className="custom_text_input--line-input"
          type="text"
          maxLength={maxLengthLine2}
          size={maxLengthLine2}
          value={line2}
          onChange={(evt) => handleInput(evt, onValidLine2Change)}
          alt="Line two custom text input"
        />
      </div>
    </div>
  );
}

export default SignTextInput;
