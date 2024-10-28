import * as React from 'react';
import fp from 'lodash/fp';
import * as Sentry from '@sentry/browser';
import { Channel, Socket } from 'phoenix';
import Viewer from './Viewer';
import lineToColor from './colors';
import {
  SignConfigs,
  SignContent,
  ConfiguredHeadways,
  Alerts,
  SignGroup,
  SignGroupMap,
  RouteSignGroupsWithDeletions,
} from './types';

/* eslint-disable camelcase */

declare global {
  interface Window {
    userToken: string;
  }
}

type SignGroupApi = (SignGroup & { route_id: string }) | Record<string, never>;

interface ViewerAppProps {
  initialAlerts: Alerts;
  initialSigns: SignContent;
  initialSignConfigs: SignConfigs;
  initialConfiguredHeadways: ConfiguredHeadways;
  initialSignGroups: SignGroupMap;
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
    signGroups: SignGroupMap;
    currentTime: number;
    signsChannel: null | Channel;
    headwaysChannel: null | Channel;
    chelseaBridgeAnnouncementsChannel: null | Channel;
    signGroupsChannel: null | Channel;
    alertsChannel: null | Channel;
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
    this.setChelseaBridgeAnnouncements =
      this.setChelseaBridgeAnnouncements.bind(this);
    this.setSignGroups = this.setSignGroups.bind(this);
    this.changeLine = this.changeLine.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.state = {
      alerts: props.initialAlerts,
      signs: props.initialSigns,
      signConfigs: props.initialSignConfigs,
      configuredHeadways: props.initialConfiguredHeadways,
      signGroups: props.initialSignGroups,
      currentTime: Date.now(),
      signsChannel: null,
      headwaysChannel: null,
      chelseaBridgeAnnouncementsChannel: null,
      signGroupsChannel: null,
      alertsChannel: null,
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

    const signsChannel = socket.channel('signs:all', {});
    const headwaysChannel = socket.channel('headways:all', {});
    const chelseaBridgeAnnouncementsChannel = socket.channel(
      'chelseaBridgeAnnouncements:all',
      {},
    );
    const signGroupsChannel = socket.channel('signGroups:all', {});
    const alertsChannel = socket.channel('alerts:all', {});

    [
      signsChannel,
      headwaysChannel,
      chelseaBridgeAnnouncementsChannel,
      signGroupsChannel,
      alertsChannel,
    ].forEach((channel) => channel.join().receive('ok', () => true));

    signsChannel.on('sign_update', (sign) => {
      this.setState((prevState) => ({
        signs: {
          ...prevState.signs,
          [sign.sign_id]: sign,
        },
      }));
    });

    signsChannel.on('new_sign_configs_state', (state) => {
      this.setState({ signConfigs: state });
    });

    headwaysChannel.on('new_configured_headways_state', (state) => {
      this.setState({ configuredHeadways: state });
    });

    alertsChannel.on('new_alert_state', (alertState) => {
      this.setState({ alerts: alertState });
    });

    signGroupsChannel.on('new_sign_groups_state', (signGroupState) => {
      this.setState({ signGroups: signGroupState });
    });

    chelseaBridgeAnnouncementsChannel.on(
      'new_chelsea_bridge_announcements_state',
      (chelseaBridgeAnnouncementState) => {
        this.setState({
          chelseaBridgeAnnouncements:
            chelseaBridgeAnnouncementState.chelsea_bridge_announcements,
        });
      },
    );

    signsChannel.on('auth_expired', () => {
      window.location.reload();
    });

    this.setState({
      signsChannel,
      headwaysChannel,
      chelseaBridgeAnnouncementsChannel,
      signGroupsChannel,
      alertsChannel,
    });

    this.timerID = setInterval(() => this.updateTime(), 1000);
  }

  componentWillUnmount(): void {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  setConfigs(signConfigs: SignConfigs): void {
    const { signsChannel: channel } = this.state;

    if (channel) {
      channel.push('changeSigns', signConfigs);

      this.setState((oldState) => ({
        ...oldState,
        signConfigs: { ...oldState.signConfigs, ...signConfigs },
      }));
    } else {
      Sentry.captureMessage('signsChannel not present');
    }
  }

  setConfiguredHeadways(newConfigs: ConfiguredHeadways): void {
    const { headwaysChannel: channel, configuredHeadways } = this.state;

    if (channel) {
      // deep merge to preserve old values during transition
      const newConfigsState = fp.merge(configuredHeadways, newConfigs);
      channel.push('changeHeadways', newConfigsState);
      this.setState((oldState) => ({
        ...oldState,
        configuredHeadways: newConfigsState,
      }));
    } else {
      Sentry.captureMessage('headwaysChannel not present');
    }
  }

  setChelseaBridgeAnnouncements(state: 'off' | 'auto'): void {
    const { chelseaBridgeAnnouncementsChannel: channel } = this.state;

    if (channel) {
      channel.push('changeChelseaBridgeAnnouncements', { mode: state });

      this.setState(() => ({ chelseaBridgeAnnouncements: state }));
    } else {
      Sentry.captureMessage('chelseaBridgeAnnouncementsChannel not present');
    }
  }

  setSignGroups(line: string, signGroups: RouteSignGroupsWithDeletions): void {
    const { signGroupsChannel: channel } = this.state;

    if (channel) {
      const data: { [key: string]: SignGroupApi } = {};

      Object.entries(signGroups).forEach(([key, signGroup]) => {
        if (Object.keys(signGroup).length > 0) {
          data[key] = { ...(signGroup as SignGroup), ...{ route_id: line } };
        } else {
          data[key] = {};
        }
      });

      channel.push('changeSignGroups', { data });
    } else {
      Sentry.captureMessage('signGroupsChannel not present');
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
      alerts,
      signs,
      currentTime,
      line,
      signConfigs,
      readOnly,
      configuredHeadways,
      signGroups,
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
            key={line}
            alerts={alerts}
            signs={signs}
            signConfigs={signConfigs}
            setConfigs={this.setConfigs}
            configuredHeadways={configuredHeadways}
            setConfiguredHeadways={this.setConfiguredHeadways}
            signGroups={signGroups}
            setSignGroups={this.setSignGroups}
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
