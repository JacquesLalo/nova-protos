// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

export interface AppState {
  scale: number;
  color: string;
}

class App extends React.Component<{}, AppState> {
  raq: number;
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      color: "red",
    };

    this.update = this.update.bind(this);

    this.update();

    document.addEventListener("triggerdown", () =>
      this.setState({color: "blue"}),
    );
    document.addEventListener("triggerup", () => this.setState({color: "red"}));
  }
  update() {
    this.raq = requestAnimationFrame(() => {
      this.setState({scale: Math.abs(Math.sin(new Date().getTime() / 1000))});
      this.update();
    });
  }
  render() {
    return (
      <a-scene>
        <a-obj-model
          src="./kartell/obj/kartell-room.obj"
          mtl="./kartell/obj/kartell-room.mtl"
        />
        <a-obj-model
          scale="0.013 0.013 0.013"
          src="./kartell/obj/chair.obj"
          material={`color: ${this.state.color}`}
        />
        <a-obj-model
          id="collision-box"
          src="./kartell/obj/Collision.obj"
          mtl="./kartell/obj/Collision.mtl"
          class="collidable"
          scale="0.9 0.9 0.9"
          visible="false"
        />
        <a-sky color="#ECECEC" />
        <a-entity
          laser-controls="hand: right"
          raycaster="objects: .collidable"
          line="color: red; opacity: 0.75"
        />
      </a-scene>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("mount-point"));
