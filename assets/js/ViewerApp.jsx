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
      currentTime: Date.now()
    };
  }

  componentDidMount() {
    const socket = new Socket('/socket', { params: { token: window.userToken } });
    socket.connect();

    const channel = socket.channel('signs:all', {});
    channel
      .join()
      .receive('ok', () => {});

    channel.on('sign_update', ({ sign_id: signId, duration: duration, line_number: lineNumber, text: content }) => {
      this.setState(prevState => ({
        signs: updateSigns(prevState.signs, { signId, duration, lineNumber, content }),
      }));
    });

    window.setInterval(this.updateTime, 1000);
  }

  updateTime() {
    this.setState(prevState => ({
      currentTime: Date.now()
    }));
  }

  render() {
    const { signs } = this.state;
    const { currentTime } = this.state;
    return (
      <div className="viewer">
        <Viewer signs={signs} currentTime={currentTime} />
      </div>
    );
  }
}

ViewerApp.propTypes = {
  initialSigns: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};

export default ViewerApp;
