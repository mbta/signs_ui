function updateSigns(oldSigns, { signId, lineNumber, content }) {
  const newValues = oldSigns[signId] ? oldSigns[signId].slice(0) : ['', ''];
  newValues[lineNumber - 1] = content;

  return {
    ...oldSigns,
    [signId]: newValues,
  };
}

/* eslint-disable import/prefer-default-export */
export { updateSigns };
