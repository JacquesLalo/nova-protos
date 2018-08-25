// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

export interface AppState {
  scale: number;
}

class App extends React.Component<{}, AppState> {
  raq: number;
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
    };

    this.update = this.update.bind(this);

    this.update();
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
        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" />
        <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" />
        <a-cylinder
          position="1 0.75 -3"
          radius={this.state.scale}
          height="1.5"
          color="#FFC65D"
        />
        <a-plane
          position="0 0 -4"
          rotation="-90 0 0"
          width="4"
          height="4"
          color="#7BC8A4"
        />
        <a-obj-model
          src="./kartell/obj/office.obj"
          mtl="./kartell/obj/office.mtl"
        />
        <a-sky color="#ECECEC" />
        <a-entity laser-controls="hand: left" />
      </a-scene>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("mount-point"));
