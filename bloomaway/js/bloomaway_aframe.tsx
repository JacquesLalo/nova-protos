import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

export interface AppState {
  triggerDown: boolean;
  hoveredButton: string;
  currentScene: number;
}

const defaultState = {
  triggerDown: false,
  hoveredButton: "",
  currentScene: 0,
};

const {PI, sin, cos} = Math;

const sphericalToCartesian = (theta: number, phi: number, rho: number) => ({
  x: rho * sin(phi) * cos(theta),
  y: rho * sin(phi) * sin(theta),
  z: rho * cos(phi),
});

class App extends React.Component<{}, AppState> {
  raq: number;
  buttonCoords: Array<{theta: number; phi: number}>;
  scenes: Array<string>;

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
    this.scenes = ["stadium"];

    this.update = this.update.bind(this);
    this.onTriggerUp = this.onTriggerUp.bind(this);
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.getButtons = this.getButtons.bind(this);

    this.update();

    document.addEventListener("triggerdown", this.onTriggerDown);
    document.addEventListener("triggerup", this.onTriggerUp);
    document.addEventListener("raycaster-intersected", this.onTriggerUp);
    document.addEventListener(
      "raycaster-intersected-cleared",
      this.onTriggerUp,
    );
  }
  onRaycasterIntersected(e: CustomEvent) {
    this.setState({hoveredButton: e.detail.el.id});
  }
  onRaycasterIntersectedCleared(e: CustomEvent) {
    this.setState({hoveredButton: defaultState.hoveredButton});
  }
  onTriggerDown() {
    if (this.state.hoveredButton !== defaultState.hoveredButton) {
      const b = this.state.hoveredButton;
      this.setState({currentScene: this.scenes[b[b.length - 1]]});
    }
  }

  onTriggerUp() {
    this.setState({
      triggerDown: false,
      hoveredButton: defaultState.hoveredButton,
    });
  }

  update() {
    this.raq = requestAnimationFrame(() => {
      this.update();
    });
  }
  getButtons() {
    return this.buttonCoords.map(({phi, theta}, i) => {
      const cart = sphericalToCartesian(theta, phi, 0.09);
      const id = `button${i}`;

      return (
        <a-sphere
          color="yellow"
          radius="0.005"
          position={`${cart.x} ${cart.y} ${cart.z}`}
          opacity={id === this.state.hoveredButton ? "1" : 0.3}
          key={i}
          className={`torus-button`}
          id={id}
        />
      );
    });
  }
  render() {
    const currentScene = this.scenes[this.state.currentScene];
    console.log("hello", currentScene);
    return (
      <a-scene>
        <a-entity
          gltf-model={`url(./bloomaway/gltf/${currentScene}/scene.gltf)`}
          position="0 1.63 -3.3"
          scale="0.3 0.3 0.3"
        />

        <a-entity rotation="0 -90 0" scale="3 3 3" position="0 1.6 0">
          <a-obj-model src="./torus/obj/map/map.obj" />
          <a-obj-model src="./torus/obj/ground/ground.obj" />
          <a-entity rotation="0 -90 0" position="0 0 0">
            {this.getButtons()}
          </a-entity>
        </a-entity>
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
