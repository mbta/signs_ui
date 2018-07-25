import React, { Component } from 'react';
import {Socket} from "phoenix";
import Viewer from "./Viewer";

class ViewerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    const socket = new Socket("/socket", {params: {token: window.userToken}});
    socket.connect();

    const channel = socket.channel("signs:all", {});
    channel
      .join()
      .receive("ok", response => {console.log("Joined successfully", response)});

    channel.on("new_msg", payload => {
      this.setState({
        messages: [payload.body, ...(this.state.messages.slice(0, 50))]
      })
    })
  }

  render() {
    return (
      <div className="viewer">
        <Viewer messages={this.state.messages} />
      </div>
    );
  }
}

export default ViewerApp;
