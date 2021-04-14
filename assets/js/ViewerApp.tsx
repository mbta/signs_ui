import * as React from 'react';
import { Channel, Socket } from 'phoenix';
import Viewer from './Viewer';
import lineToColor from './colors';
import { SignConfigs, SignContent, ConfiguredHeadways, Alerts } from './types';

declare global {
  interface Window {
    userToken: string;
  }
}

interface ViewerAppProps {
  initialSigns: SignContent;
  initialSignConfigs: SignConfigs;
  initialConfiguredHeadways: ConfiguredHeadways;
  readOnly: boolean;
  signOutPath: string;
  initialChelseaBridgeAnnouncements?: 'auto' | 'off';
}

class ViewerApp extends React.Component<
  ViewerAppProps,
  {
    alerts: Alerts;
    signs: SignContent;
    signConfigs: SignConfigs;
    configuredHeadways: ConfiguredHeadways;
    currentTime: number;
    channel: null | Channel;
    readOnly: boolean;
    signOutPath: string;
    line?: string;
    chelseaBridgeAnnouncements: 'auto' | 'off';
  }
> {
  private timerID?: ReturnType<typeof setTimeout>;

  constructor(props: ViewerAppProps) {
    super(props);

    this.setConfigs = this.setConfigs.bind(this);
    this.setConfiguredHeadways = this.setConfiguredHeadways.bind(this);
    this.setChelseaBridgeAnnouncements = this.setChelseaBridgeAnnouncements.bind(
      this,
    );
    this.changeLine = this.changeLine.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.state = {
      alerts: {},
      signs: props.initialSigns,
      signConfigs: props.initialSignConfigs,
      configuredHeadways: props.initialConfiguredHeadways,
      currentTime: Date.now(),
      channel: null,
      readOnly: props.readOnly,
      signOutPath: props.signOutPath,
      chelseaBridgeAnnouncements:
        props.initialChelseaBridgeAnnouncements || 'off',
    };
  }

  componentDidMount(): void {
    const socket = new Socket('/socket', {
      params: { token: window.userToken },
    });
    socket.connect();

    const channel = socket.channel('signs:all', {});
    channel.join().receive('ok', () => true);

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

    channel.on('new_alert_state', (state) => {
      console.log(state); // eslint-disable-line no-console
      this.setState({ alerts: state });
    });

    channel.on('auth_expired', () => {
      window.location.reload(true);
    });

    this.setState({ channel });

    this.timerID = setInterval(() => this.updateTime(), 1000);
  }

  componentWillUnmount(): void {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  setConfigs(signConfigs: SignConfigs): void {
    const { channel } = this.state;

    if (channel) {
      channel.push('changeSigns', signConfigs);

      this.setState((oldState) => ({
        ...oldState,
        signConfigs: { ...oldState.signConfigs, ...signConfigs },
      }));
    }
  }

  setConfiguredHeadways(newConfigs: ConfiguredHeadways): void {
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

  setChelseaBridgeAnnouncements(state: 'off' | 'auto'): void {
    const { channel } = this.state;

    if (channel) {
      channel.push('changeChelseaBridgeAnnouncements', { mode: state });

      this.setState(() => ({ chelseaBridgeAnnouncements: state }));
    }
  }

  changeLine(line: string): void {
    document.body.style.backgroundColor = lineToColor(line);
    this.setState({ line });
  }

  updateTime(): void {
    this.setState({
      currentTime: Date.now(),
    });
  }

  render(): JSX.Element {
    const {
      signs,
      currentTime,
      line,
      signConfigs,
      readOnly,
      configuredHeadways,
      signOutPath,
      chelseaBridgeAnnouncements,
    } = this.state;
    return (
      <div className="viewer--main container">
        <div className="row">
          <div className="viewer--line-switcher col-auto mr-auto">
            <button
              type="button"
              id="blue-button"
              onClick={() => this.changeLine('Blue')}
            >
              Blue
            </button>
            <button
              type="button"
              id="red-button"
              onClick={() => this.changeLine('Red')}
            >
              Red
            </button>
            <button
              type="button"
              id="orange-button"
              onClick={() => this.changeLine('Orange')}
            >
              Orange
            </button>
            <button
              type="button"
              id="green-button"
              onClick={() => this.changeLine('Green')}
            >
              Green
            </button>
            <button
              type="button"
              id="mattapan-button"
              onClick={() => this.changeLine('Mattapan')}
            >
              Mattapan
            </button>
            <button
              type="button"
              id="sl3-button"
              onClick={() => this.changeLine('Silver')}
            >
              Silver Line
            </button>
            <button
              type="button"
              id="busway-button"
              onClick={() => this.changeLine('Busway')}
            >
              Busway
            </button>
          </div>
          <div className="col-auto">
            <a href={signOutPath} id="sign-out-link">
              refresh credentials
            </a>
          </div>
        </div>
        {line && (
          <Viewer
            signs={signs}
            signConfigs={signConfigs}
            configuredHeadways={configuredHeadways}
            setConfiguredHeadways={this.setConfiguredHeadways}
            setConfigs={this.setConfigs}
            currentTime={currentTime}
            line={line}
            chelseaBridgeAnnouncements={chelseaBridgeAnnouncements}
            setChelseaBridgeAnnouncements={this.setChelseaBridgeAnnouncements}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  }
}

export default ViewerApp;
