function updateSigns(oldSigns, {
  signId, lineNumber, content, duration,
}) {
  const newValues = oldSigns[signId] ? oldSigns[signId].slice(0) : [{ content: '', duration: '0' }, { content: '', duration: '0' }];
  newValues[lineNumber - 1] = { content, duration };

  return {
    ...oldSigns,
    [signId]: newValues,
  };
}

/* eslint-disable import/prefer-default-export */
export { updateSigns };
