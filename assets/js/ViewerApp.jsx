import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'phoenix';
import Viewer from './Viewer';
import { updateSigns } from './helpers';

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.updateTime = this.updateTime.bind(this);
    this.changeLine = this.changeLine.bind(this);

    this.state = {
      signs: props.initialSigns,
      currentTime: Date.now(),
      line: '',
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

    this.timerID = setInterval(
      () => this.updateTime(),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  updateTime() {
    this.setState({
      currentTime: Date.now(),
    });
  }

  changeLine(line) {
    this.setState({ line });
  }

  render() {
    const { signs, currentTime, line } = this.state;
    return (
      <div className="viewer">
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
        <Viewer signs={signs} currentTime={currentTime} line={line} />
      </div>
    );
  }
}

ViewerApp.propTypes = {
  initialSigns: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
};

export default ViewerApp;
