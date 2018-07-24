import css from "../css/app.css";
import "phoenix_html";
import {Socket} from "phoenix";
import toggle from "./toggle-all.js";
import Elm from "../elm/src/Main.elm";

const elmRoot = document.getElementById("viewer-elm-root");
if (elmRoot) {
  const elm = Elm.Main.embed(elmRoot);

  const socket = new Socket("/socket", {params: {token: window.userToken}});
  socket.connect();

  const channel = socket.channel("viewer:all", {});
  channel
    .join()
    .receive("ok", response => {console.log("Joined successfully", response)});
  channel.on("new_msg", payload => { elm.ports.signMessage.send(payload.body) });
}
