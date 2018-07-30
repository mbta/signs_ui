import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sign from './Sign';

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.sortedKeys = this.sortedKeys.bind(this);
  }

  sortedKeys() {
    const { signs } = this.props;
    return Object.keys(signs).sort();
  }

  render() {
    const { arincMap, layoutConfig, signs } = this.props;
    return (
      <div>
        {layoutConfig.map( (config) => {
          const name = config[0];
          const stations = config[1];
          return(
            <div key={name}>
              <h3>{name}</h3>
              {stations.map((station) => {
                return(
                  <div>
                  <div style={{overflow: "auto"}}>
                    {["s", "w", "c", "m", "e", "n"].map((direction) => {
                      const arincId = `${station}-${direction}`;
                      const id = arincMap[arincId];
                      const lines = signs[arincId];
                      if (id && lines) {
                        return <Sign key={id} signId={id} lineOne={lines[0]} lineTwo={lines[1]} />
                      }
                    })}
                  </div>
                  <hr />
                  </div>
                );
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

Viewer.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default Viewer;
