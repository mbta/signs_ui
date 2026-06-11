import * as React from 'react';

function isValidText(text: string) {
  return !/[^a-zA-Z0-9,/!@()': +]/.test(text);
}

type SignTextValue = {
  line1: string;
  line2: string;
  audio_text: string;
};

interface SignTextInputProps {
  signID: string;
  value: SignTextValue;
  onChange: (value: SignTextValue) => void;
}

const deriveAudioText = (value: SignTextValue) =>
  [value.line1, value.line2].filter((x) => x).join(' ');

function SignTextInput({ signID, value, onChange }: SignTextInputProps) {
  const [showTipText, setShowTipText] = React.useState(false);
  const [modifyAudio, setModifyAudio] = React.useState(
    value.audio_text !== deriveAudioText(value),
  );
  const [reviewingAudio, setReviewingAudio] = React.useState<string>();

  const handleInput = (text: string, field: 'line1' | 'line2') => {
    if (isValidText(text)) {
      setShowTipText(false);
      const newValue = { ...value, [field]: text };
      onChange(
        modifyAudio
          ? newValue
          : { ...newValue, audio_text: deriveAudioText(newValue) },
      );
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
          value={value.line1}
          onChange={(e) => handleInput(e.target.value, 'line1')}
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
          value={value.line2}
          onChange={(e) => handleInput(e.target.value, 'line2')}
          alt="Line two custom text input"
        />
      </div>
      <label className="d-block mb-0">
        <input
          type="checkbox"
          checked={modifyAudio}
          onChange={(e) => {
            const newModifyAudio = e.target.checked;
            setModifyAudio(newModifyAudio);
            if (!newModifyAudio) {
              onChange({ ...value, audio_text: deriveAudioText(value) });
            }
          }}
        />{' '}
        Modify Audio Readout
      </label>
      {modifyAudio && (
        <div>
          <input
            type="text"
            value={value.audio_text}
            onChange={(e) => onChange({ ...value, audio_text: e.target.value })}
            alt="Custom audio text input"
          />
        </div>
      )}
      {reviewingAudio === undefined ? (
        <button
          className="custom_text_input--review-button"
          onClick={() => setReviewingAudio(value.audio_text)}
        >
          Review Audio
        </button>
      ) : (
        <>
          <div>Reviewing audio...</div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            src={`/preview_audio?text=${encodeURIComponent(reviewingAudio)}`}
            autoPlay
            onEnded={() => setReviewingAudio(undefined)}
            onError={() => setReviewingAudio(undefined)}
          />
        </>
      )}
    </div>
  );
}

export default SignTextInput;
