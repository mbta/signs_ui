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
  const obscuredElement = elementId && document.getElementById(elementId);
  let top;
  let left;
  let width;
  let height;

  if (obscuredElement) {
    const box = obscuredElement.getBoundingClientRect();
    top = box.top;
    left = box.left;
    width = box.width;
    height = box.height;
  } else {
    top = window.scrollY;
    left = window.scrollX;
    width = window.innerWidth;
    height = window.innerHeight;
  }

  return (
    <div
      className="modal_prompt--backdrop"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      data-testid="modal-prompt"
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
