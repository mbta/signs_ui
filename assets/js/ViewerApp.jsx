import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'phoenix';
import Viewer from './Viewer';
import lineToColor from './colors';
import { signConfigType, signContentType, configuredHeadwayType } from './types';

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.setConfigs = this.setConfigs.bind(this);
    this.setConfiguredHeadways = this.setConfiguredHeadways.bind(this);
    this.changeLine = this.changeLine.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.state = {
      signs: props.initialSigns,
      signConfigs: props.initialSignConfigs,
      configuredHeadways: props.initialConfiguredHeadways,
      currentTime: Date.now(),
      channel: null,
      readOnly: props.readOnly,
      signOutPath: props.signOutPath,
    };
  }

  componentDidMount() {
    const socket = new Socket('/socket', { params: { token: window.userToken } });
    socket.connect();

    const channel = socket.channel('signs:all', {});
    channel
      .join()
      .receive('ok', () => { });

    channel.on('sign_update', (sign) => {
      this.setState((prevState) => ({
        signs: {
          ...prevState.signs,
          [sign.sign_id]: sign,
        },
      }));
    });

    channel.on('new_sign_configs_state', (state) => {
      this.setState({ signConfigs: state });
    });

    channel.on('new_configured_headways_state', (state) => {
      this.setState({ configuredHeadways: state });
    });

    channel.on('auth_expired', () => {
      window.location.reload(true);
    });

    this.setState({ channel });

    this.timerID = setInterval(
      () => this.updateTime(),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  setConfigs(signConfigs) {
    const { channel } = this.state;

    if (channel) {
      channel.push('changeSigns', signConfigs);

      this.setState((oldState) => ({
        ...oldState,
        signConfigs: { ...(oldState.signConfigs), ...signConfigs },
      }));
    }
  }

  setConfiguredHeadways(newConfigs) {
    const { channel, configuredHeadways } = this.state;

    if (channel) {
      const newConfigsState = { ...configuredHeadways, ...newConfigs };
      channel.push('changeHeadways', newConfigsState);
      this.setState((oldState) => ({
        ...oldState,
        configuredHeadways: newConfigsState,
      }));
    }
  }

  changeLine(line) {
    document.body.style.backgroundColor = lineToColor(line);
    this.setState({ line });
  }

  updateTime() {
    this.setState({
      currentTime: Date.now(),
    });
  }

  render() {
    const {
      signs, currentTime, line, signConfigs, readOnly, configuredHeadways, signOutPath,
    } = this.state;
    return (
      <div className="viewer--main container">
        <div className="row">
          <div className="viewer--line-switcher col-auto mr-auto">
            <button type="button" id="blue-button" onClick={() => this.changeLine('Blue')}>
              Blue
            </button>
            <button type="button" id="red-button" onClick={() => this.changeLine('Red')}>
              Red
            </button>
            <button type="button" id="orange-button" onClick={() => this.changeLine('Orange')}>
              Orange
            </button>
            <button type="button" id="green-button" onClick={() => this.changeLine('Green')}>
              Green
            </button>
            <button type="button" id="mattapan-button" onClick={() => this.changeLine('Mattapan')}>
              Mattapan
            </button>
            <button type="button" id="sl3-button" onClick={() => this.changeLine('SL3')}>
              Silver Line 3
            </button>
          </div>
          <div className="col-auto">
            <a href={signOutPath} id="sign-out-link">sign out</a>
          </div>
        </div>
        {line
          && (
            <Viewer
              signs={signs}
              signConfigs={signConfigs}
              configuredHeadways={configuredHeadways}
              setConfiguredHeadways={this.setConfiguredHeadways}
              setConfigs={this.setConfigs}
              currentTime={currentTime}
              line={line}
              readOnly={readOnly}
            />
          )}
      </div>
    );
  }
}

ViewerApp.propTypes = {
  initialSigns: PropTypes.objectOf(signContentType).isRequired,
  initialSignConfigs: PropTypes.objectOf(signConfigType).isRequired,
  initialConfiguredHeadways: PropTypes.objectOf(configuredHeadwayType).isRequired,
  readOnly: PropTypes.bool.isRequired,
  signOutPath: PropTypes.string.isRequired,
};

export default ViewerApp;
