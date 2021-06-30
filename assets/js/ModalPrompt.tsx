import * as React from 'react';

interface ModalPromptProps {
  acceptText: string;
  onAccept: () => void;
  onCancel: () => void;
  contents: JSX.Element;
  elementId?: string;
}

function ModalPrompt({
  acceptText,
  onAccept,
  onCancel,
  contents,
  elementId,
}: ModalPromptProps): JSX.Element {
  const obscuredElement = elementId
    ? document.getElementById(elementId) || document.body
    : document.body;

  const box = obscuredElement.getBoundingClientRect();

  return (
    <div
      className="modal_prompt--backdrop"
      style={{
        position: 'absolute',
        top: `${box.top}px`,
        left: `${box.left}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      }}
    >
      <div className="modal_prompt--container">
        {contents}
        <button
          type="button"
          className="btn btn-primary mr-1"
          onClick={onAccept}
        >
          {acceptText}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ModalPrompt;
