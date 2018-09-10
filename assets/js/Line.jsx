import React from 'react';
import PropTypes from 'prop-types';
import Station from './Station';
import { stationConfig, arincToRealtimeId } from './mbta';

function name(line) {
  if (line === 'Red') { return 'Red Line'; }
  if (line === 'Blue') { return 'Blue Line'; }
  if (line === 'Orange') { return 'Orange Line'; }
  if (line === 'Mattapan') { return 'Mattapan'; }
  if (line === 'SL3') { return 'SL3'; }

  return '';
}

function setEnabledStations(enablerFn, stations, line, val) {
  const statuses = {};

  stations.forEach((station) => {
    ['n', 's', 'e', 'w', 'm', 'c'].forEach((zone) => {
      const realtimeId = arincToRealtimeId(`${station.id}-${zone}`, line);
      if (realtimeId) {
        statuses[realtimeId] = val;
      }
    });
  });

  enablerFn(statuses);
}

function Line({
  signs, currentTime, line, enabledSigns, setEnabled,
}) {
  const stations = stationConfig[line] || [];

  return (
    <div>
      <h1>
        {name(line)}
      </h1>

      <div className="viewer--toggle-all">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => { setEnabledStations(setEnabled, stations, line, true); }}
        >
          Enable all
        </button>

        &nbsp;

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => { setEnabledStations(setEnabled, stations, line, false); }}
        >
          Disable all
        </button>
      </div>
      {
        stations.map(station => (
          <Station
            key={station.id}
            config={station}
            signs={signs}
            currentTime={currentTime}
            line={line}
            enabledSigns={enabledSigns}
            setEnabled={setEnabled}
          />
        ))
      }
    </div>
  );
}

Line.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  enabledSigns: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  setEnabled: PropTypes.func.isRequired,
};

export default Line;
