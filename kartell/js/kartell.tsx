// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

export interface AppState {
  scale: number;
  triggerDown: boolean;
  intersection: boolean,
}

const defaultState = {
    scale: 1,
    triggerDown: false,
    intersection: false,
}

class App extends React.Component<{}, AppState> {
  raq: number;
  constructor(props) {
    super(props);
    this.state = defaultState

    this.update = this.update.bind(this);

    this.update();

    document.addEventListener("triggerdown", () => {
      this.setState({triggerDown: true});
    });

    document.addEventListener("triggerup", () => {
      this.setState({triggerDown: false});
    });

    document.addEventListener("raycaster-intersected", (e: CustomEvent) => {
      if(e.detail.el.id === "model" && !this.state.intersection)
        this.setState({intersection: true});
    });

    document.addEventListener("raycaster-intersected-cleared", (e: CustomEvent) => {
      this.setState({intersection: false});
    });
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
          id="model"
          scale="0.013 0.013 0.013"
          src="./kartell/obj/chair.obj"
          material={`color: ${this.state.triggerDown && this.state.intersection ? "red" : "green"}`}
        />
        <a-entity class="collidable"
            geometry="primitive: box" material="color: rgba(0, 0, 0); opacity: 0.1" scale="1.5 1.5 0.8" position="0 0.8 0" />
        <a-obj-model
          id="collision-box"
          src="./kartell/obj/Collision.obj"
          mtl="./kartell/obj/Collision.mtl"
          scale="0.9 0.9 0.9"
          visible="false"
        />
        <a-sky color="#0000ff" />
        <a-entity
          laser-controls="hand: right"
          raycaster="objects: .collidable; recursive: true"
          line="color: red; opacity: 0.75"
        />
      </a-scene>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("mount-point"));
