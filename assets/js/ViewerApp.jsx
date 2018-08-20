import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'phoenix';
import Viewer from './Viewer';
import { updateSigns } from './helpers';

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.updateTime = this.updateTime.bind(this);
    this.blueLine = this.blueLine.bind(this);
    this.redLine = this.redLine.bind(this);
    this.orangeLine = this.orangeLine.bind(this);
    this.mattapanLine = this.mattapanLine.bind(this);
    this.silverLine = this.silverLine.bind(this);

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

  blueLine() {
    this.setState({
      line: 'Blue',
    });
  }

  mattapanLine() {
    this.setState({
      line: 'Mattapan',
    });
  }

  redLine() {
    this.setState({
      line: 'Red',
    });
  }

  orangeLine() {
    this.setState({
      line: 'Orange',
    });
  }

  silverLine() {
    this.setState({
      line: 'SL3',
    });
  }

  render() {
    const { signs, currentTime, line } = this.state;
    return (
      <div className="viewer">
        <button type="button" onClick={this.blueLine}>
          Blue
        </button>
        <button type="button" onClick={this.redLine}>
          Red
        </button>
        <button type="button" onClick={this.orangeLine}>
          Orange
        </button>
        <button type="button" onClick={this.mattapanLine}>
          Mattapan
        </button>
        <button type="button" onClick={this.silverLine}>
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
