import React, { Component } from 'react';
import {Socket} from "phoenix";
import Viewer from "./Viewer";

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
      let newValues = (this.state.signs[sign_id] || ["", ""]).slice(0);
      newValues[line_number - 1] = text;

      let newSigns = {
        ...this.state.signs,
        [sign_id]: newValues
      };

      this.setState({
        signs: newSigns
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
