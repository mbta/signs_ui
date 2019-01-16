import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lineToColor from './colors';

function displayLine(duration, currentTime) {
  return (Date.parse(duration) - currentTime) > 0;
}

function fontSize(signId) {
  if (signId === 'NB' || signId === 'SB' || signId === 'EB' || signId === 'WB' || signId === 'MZ' || signId === 'CP') {
    return { fontSize: '1.5em' };
  }
  return {};
}

function makeConfig(mode) {
  if (mode == 'auto') {
    return { 'mode': 'auto' };
  }

  if (mode == 'off') {
    return { 'mode': 'off', 'expires': null };
  }

  if (mode == 'static_text') {
    return { 'mode': 'static_text', 'expires': null, 'line1': '', 'line2': '' };
  }
}

class Sign extends Component {
  constructor(props) {
    super(props);

    this.saveStaticText = this.saveStaticText.bind(this);

    if (props.signConfig.mode === 'static_text') {
      this.state = {
        staticLine1: props.signConfig.line1,
        staticLine2: props.signConfig.line2,
        customChanges: false
      }
    } else {
      this.state = { staticLine1: '', staticLine2: '', customChanges: false }
    }
  }

  saveStaticText() {
    const { setConfigs, realtimeId } = this.props;
    const { staticLine1, staticLine2 } = this.state;

    this.setState({ customChanges: false })

    setConfigs({
      [realtimeId]: {
        'mode': 'static_text',
        'line1': staticLine1,
        'line2': staticLine2,
        'expires': null
      }
    })
  }

  render() {
    const {
      signId,
      lineOne,
      lineOneDuration,
      lineTwo,
      lineTwoDuration,
      currentTime,
      line,
      signConfig,
      setConfigs,
      realtimeId,
    } = this.props;

    return (
      <div>
        <div className="viewer--sign">
          <div className="viewer--sign-id" style={{ borderTopColor: lineToColor(line) }}>
            <span style={fontSize(signId)}>
              {signId}
            </span>
            <div>
              <select id={realtimeId} value={signConfig['mode']} onChange={
                (event) => {
                  setConfigs({ [realtimeId]: makeConfig(event.target.value) })
                }
              }>
                <option value="auto">On</option>
                <option value="off">Off</option>
                <option value="static_text">Text</option>
              </select>
              {/* eslint-disable-next-line jsx-a11y/label-has-for */}
              <label htmlFor={realtimeId} />
            </div>
          </div>
          <div className="viewer--sign-lines">
            <div className="viewer--sign-line">
              {displayLine(lineOneDuration, currentTime) ? lineOne : null}
            </div>
            <div className="viewer--sign-line">
              {displayLine(lineTwoDuration, currentTime) ? lineTwo : null}
            </div>
          </div>
        </div>

        {signConfig['mode'] == 'static_text' &&
          <div className="viewer--static-text-form">
            <div>Set custom text:</div>
            <div>
              <input
                type="text"
                maxLength={18}
                size={18}
                value={this.state.staticLine1}
                onChange={(evt) => this.setState({ staticLine1: evt.target.value, customChanges: true })}
              />
            </div>
            <div>
              <input
                type="text"
                maxLength={24}
                size={24}
                value={this.state.staticLine2}
                onChange={(evt) => this.setState({ staticLine2: evt.target.value, customChanges: true })}
              />
            </div>
            <div><input type="submit" value="Apply" onClick={this.saveStaticText} />{this.state.customChanges ? '*' : ''}</div>
          </div>
        }
      </div>
    );
  }
}

Sign.propTypes = {
  signId: PropTypes.string.isRequired,
  lineOne: PropTypes.string,
  lineOneDuration: PropTypes.string,
  lineTwo: PropTypes.string,
  lineTwoDuration: PropTypes.string,
  currentTime: PropTypes.number.isRequired,
  line: PropTypes.string.isRequired,
  setConfigs: PropTypes.func.isRequired,
  signConfig: PropTypes.oneOfType([
    PropTypes.exact({ mode: PropTypes.oneOf(["off"]), expires: PropTypes.string }),
    PropTypes.exact({ mode: PropTypes.oneOf(["auto"]) }),
    PropTypes.exact({ mode: PropTypes.oneOf(["static_text"]), line1: PropTypes.string.isRequired, line2: PropTypes.string.isRequired, expires: PropTypes.string })
  ]).isRequired,
  realtimeId: PropTypes.string.isRequired,
};

Sign.defaultProps = {
  lineOne: null,
  lineOneDuration: '0',
  lineTwo: null,
  lineTwoDuration: '0',
};

export default Sign;
