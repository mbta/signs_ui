import React, { Component } from 'react';
import {Socket} from "phoenix";
import Viewer from "./Viewer";
import { updateSigns } from "./helpers";

class ViewerApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signs: props.initialSigns
    }
  }

  componentDidMount() {
    const socket = new Socket("/socket", {params: {token: window.userToken}});
    socket.connect();

    const channel = socket.channel("signs:all", {});
    channel
      .join()
      .receive("ok", response => {console.log("Joined successfully", response)});

    channel.on("sign_update", ({sign_id, line_number, text}) => {
      this.setState({
        signs: updateSigns(this.state.signs, {signId: sign_id, lineNumber: line_number, content: text})
      })
    })
  }

  render() {
    return (
      <div className="viewer">
        <Viewer signs={this.state.signs} />
      </div>
    );
  }
}

export default ViewerApp;
