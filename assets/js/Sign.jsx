import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lineToColor from './colors';
import { signConfigType } from './types';
import SetExpiration from './SetExpiration';

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
  if (mode === 'auto') {
    return { mode: 'auto' };
  }

  if (mode === 'static_text') {
    return {
      mode: 'static_text', expires: null, line1: '', line2: '',
    };
  }

  if (mode === 'headway') {
    return {
      mode: 'headway', expires: null,
    };
  }

  return { mode: 'off', expires: null };
}

function isValidText(text) {
  return !(/[^a-zA-Z0-9,.!@' ]/.test(text));
}

class Sign extends Component {
  constructor(props) {
    super(props);

    this.saveStaticText = this.saveStaticText.bind(this);
    this.handleInputLine1 = this.handleInputLine1.bind(this);
    this.handleInputLine2 = this.handleInputLine2.bind(this);

    this.state = {
      staticLine1: props.signConfig.line1 || '',
      staticLine2: props.signConfig.line2 || '',
      customChanges: false,
      tipText: false,
    };
  }

  handleInputLine1(evt) {
    const text = evt.target.value;

    if (isValidText(text)) {
      this.setState({ staticLine1: text, customChanges: true });
    } else {
      this.setState({ tipText: true });
    }
  }

  handleInputLine2(evt) {
    const text = evt.target.value;

    if (isValidText(text)) {
      this.setState({ staticLine2: text, customChanges: true });
    } else {
      this.setState({ tipText: true });
    }
  }

  saveStaticText() {
    const { setConfigs, realtimeId } = this.props;
    const { staticLine1, staticLine2 } = this.state;

    this.setState({ customChanges: false, tipText: false });

    setConfigs({
      [realtimeId]: {
        mode: 'static_text',
        line1: staticLine1,
        line2: staticLine2,
        expires: null,
      },
    });
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

    const {
      tipText,
      staticLine1,
      staticLine2,
      customChanges,
    } = this.state;

    return (
      <div>
        <div className="viewer--sign">
          <div className="viewer--sign-id" style={{ borderTopColor: lineToColor(line) }}>
            <span style={fontSize(signId)}>
              {signId}
            </span>
            <div>
              <select
                id={realtimeId}
                value={signConfig.mode}
                onChange={
                  (event) => {
                    setConfigs({ [realtimeId]: makeConfig(event.target.value) });
                  }
                }
              >
                <option value="auto">
                  On
                </option>
                <option value="off">
                  Off
                </option>
                <option value="static_text">
                  Text
                </option>
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

        {signConfig.mode === 'static_text'
          && (
            <div className="viewer--static-text-form">
              <div>
                <strong>
                  Set custom message
                </strong>
              </div>
              {tipText && (
                <small className="viewer--error-text">
                  You may use letters, numbers, and: ,.!@&quot;
                </small>
              )}
              <div>
                <input
                  className="viewer--line-input"
                  type="text"
                  maxLength={18}
                  size={18}
                  value={staticLine1}
                  onChange={this.handleInputLine1}
                />
              </div>
              <div>
                <input
                  className="viewer--line-input"
                  type="text"
                  maxLength={24}
                  size={24}
                  value={staticLine2}
                  onChange={this.handleInputLine2}
                />
              </div>
              <div>
                <input
                  className="viewer--apply-button"
                  disabled={!customChanges}
                  type="submit"
                  value="Apply"
                  onClick={this.saveStaticText}
                />
                {customChanges ? '*' : ''}
              </div>
            </div>
          )
        }
        {signConfig.mode !== 'auto' && (
          <div class="viewer--schedule-expires">
            <SetExpiration
              realtimeId={realtimeId}
              signConfig={signConfig}
              setConfigs={setConfigs}
            />
          </div>
        )}
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
  signConfig: signConfigType.isRequired,
  realtimeId: PropTypes.string.isRequired,
};

Sign.defaultProps = {
  lineOne: null,
  lineOneDuration: '0',
  lineTwo: null,
  lineTwoDuration: '0',
};

export default Sign;
