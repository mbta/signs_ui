const lineToColor = {
  Mattapan: 'rgb(218, 41, 28)',
  Red: 'rgb(218, 41, 28)',
  Blue: 'rgb(0, 61, 165)',
  Orange: 'rgb(237, 139, 0)',
  SL3: 'rgb(124, 135, 142)',
};

function colorForLine(line) {
  return lineToColor[line] || 'rgb(200, 200, 200)';
}

export default colorForLine;
