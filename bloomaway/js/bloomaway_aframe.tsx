import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

export interface AppState {}

const defaultState = {};

const {PI, sin, cos} = Math;

const sphericalToCartesian = (theta: number, phi: number, rho: number) => ({
  x: rho * sin(phi) * cos(theta),
  y: rho * sin(phi) * sin(theta),
  z: rho * cos(phi),
});

class App extends React.Component<{}, AppState> {
  raq: number;
  buttonCoords: Array<{theta: number; phi: number}>;
  constructor(props) {
    super(props);

    this.state = defaultState;
    this.buttonCoords = [
      {theta: 0, phi: 0},
      {theta: PI / 5, phi: PI / 3},
      {theta: PI / 10, phi: -PI / 3},
      {theta: -PI / 10, phi: PI / 3},
      {theta: -PI / 10, phi: -PI / 3},
    ];

    this.update = this.update.bind(this);
    this.getButtons = this.getButtons.bind(this);

    this.update();

    document.addEventListener("thumbstickmoved", (e: CustomEvent) => {});
    document.addEventListener("triggerdown", () => {});
    document.addEventListener("triggerup", () => {});
    document.addEventListener("trackpaddown", (e: CustomEvent) => {});
    document.addEventListener("thumbstickdown", (e: CustomEvent) => {});
  }

  update() {
    this.raq = requestAnimationFrame(() => {
      this.update();
    });
  }
  getButtons() {
    return this.buttonCoords.map(({phi, theta}, i) => {
      const cart = sphericalToCartesian(theta, phi, 0.09);

      return (
        <a-sphere
          color="yellow"
          radius="0.005"
          position={`${cart.x} ${cart.y} ${cart.z}`}
          opacity=" 0.3"
          key={i}
          class={`torus-button`}
        />
      );
    });
  }
  render() {
    return (
      <a-scene>
        <a-entity rotation="0 -90 0" scale="3 3 3" position="0 1.6 0">
          <a-obj-model src="./torus/obj/map/map.obj" />
          <a-obj-model src="./torus/obj/ground/ground.obj" />
          <a-obj-model src="./torus/obj/shell/shell.obj" />
          <a-entity rotation="0 -90 0" position="0 0 0">
            {this.getButtons()}
          </a-entity>
        </a-entity>
        <a-sky color="#ECECEC" />
        <a-entity
          laser-controls="hand: right"
          raycaster="objects: .torus-button; recursive: true"
          line="color: red; opacity: 0.75"
        />
      </a-scene>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("mount-point"));
