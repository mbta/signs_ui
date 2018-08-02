import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'phoenix';
import Viewer from './Viewer';
import { updateSigns } from './helpers';

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.updateTime = this.updateTime.bind(this);
    this.state = {
      signs: props.initialSigns,
      currentTime: Date.now(),
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

  render() {
    const { signs, currentTime } = this.state;
    return (
      <div className="viewer">
        <Viewer signs={signs} currentTime={currentTime} />
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
