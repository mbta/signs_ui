import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'phoenix';
import Viewer from './Viewer';
import { updateSigns } from './helpers';
import lineToColor from './colors';

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.setEnabled = this.setEnabled.bind(this);
    this.changeLine = this.changeLine.bind(this);
    this.updateTime = this.updateTime.bind(this);

    this.state = {
      signs: props.initialSigns,
      enabledSigns: props.initialEnabledSigns,
      currentTime: Date.now(),
      channel: null,
    };
  }

  componentDidMount() {
    const socket = new Socket('/socket', { params: { token: window.userToken } });
    socket.connect();

    const channel = socket.channel('signs:all', {});
    channel
      .join()
      .receive('ok', () => {});

    channel.on('sign_update', ({
      sign_id: signId, duration, line_number: lineNumber, text: content,
    }) => {
      this.setState(prevState => ({
        signs: updateSigns(prevState.signs, {
          signId, duration, lineNumber, content,
        }),
      }));
    });

    channel.on('new_enabled_signs_state', (state) => {
      this.setState({enabledSigns: state});
    })

    this.setState({ channel });

    this.timerID = setInterval(
      () => this.updateTime(),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  setEnabled(signStatuses) {
    const { channel } = this.state;

    if (channel) {
      channel.push('changeSigns', signStatuses);

      this.setState((oldState) => ({
        ...oldState,
        enabledSigns: { ...oldState.enabledSigns, ...signStatuses },
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
      signs, currentTime, line, enabledSigns,
    } = this.state;
    return (
      <div className="viewer--main container">
        <div className="viewer--line-switcher">
          <button type="button" id="blue-button" onClick={() => this.changeLine('Blue')}>
            Blue
          </button>
          <button type="button" id="red-button" onClick={() => this.changeLine('Red')}>
            Red
          </button>
          <button type="button" id="orange-button" onClick={() => this.changeLine('Orange')}>
            Orange
          </button>
          <button type="button" id="mattapan-button" onClick={() => this.changeLine('Mattapan')}>
            Mattapan
          </button>
          <button type="button" id="sl3-button" onClick={() => this.changeLine('SL3')}>
            Silver Line 3
          </button>
        </div>
        {line
          && (
          <Viewer
            signs={signs}
            enabledSigns={enabledSigns}
            setEnabled={this.setEnabled}
            currentTime={currentTime}
            line={line}
          />
          )}
      </div>
    );
  }
}

ViewerApp.propTypes = {
  initialSigns: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  initialEnabledSigns: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
};

export default ViewerApp;
