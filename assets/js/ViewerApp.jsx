import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'phoenix';
import Viewer from './Viewer';
import { updateSigns } from './helpers';

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signs: props.initialSigns,
    };
  }

  componentDidMount() {
    const socket = new Socket('/socket', { params: { token: window.userToken } });
    socket.connect();

    const channel = socket.channel('signs:all', {});
    channel
      .join()
      .receive('ok', () => {});

    channel.on('sign_update', ({ sign_id: signId, line_number: lineNumber, text: content }) => {
      this.setState(prevState => ({
        signs: updateSigns(prevState.signs, { signId, lineNumber, content }),
      }));
    });
  }

  render() {
    const { signs } = this.state;

    return (
      <div className="viewer">
        <Viewer signs={signs} />
      </div>
    );
  }
}

ViewerApp.propTypes = {
  initialSigns: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default ViewerApp;
