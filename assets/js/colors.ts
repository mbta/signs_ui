const lineToColor: { [key: string]: string } = {
  Mattapan: 'rgb(218, 41, 28)',
  Red: 'rgb(218, 41, 28)',
  Blue: 'rgb(0, 61, 165)',
  Orange: 'rgb(237, 139, 0)',
  Green: 'rgb(0, 132, 61)',
  Silver: 'rgb(124, 135, 142)',
  Busway: 'rgb(255, 199, 44)',
};

function colorForLine(line: string): string {
  return lineToColor[line] || 'rgb(200, 200, 200)';
}

export default colorForLine;
