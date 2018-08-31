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

const createScene = (name: string, position: string = "0 0 0", scale: string = "1 1 1") => ({
    name,
    position,
    scale,
})

const sphericalToCartesian = (theta: number, phi: number, rho: number) => ({
  x: rho * sin(phi) * cos(theta),
  y: rho * sin(phi) * sin(theta),
  z: rho * cos(phi),
});

class App extends React.Component<{}, AppState> {
  raq: number;
  buttonCoords: Array<{theta: number; phi: number}>;
  scenes: Array<{name: string, position: string, scale: string}>;

  constructor(props) {
    super(props);

    this.state = defaultState;
    this.buttonCoords = [
      {theta: PI / 5, phi: PI / 3},
        {theta: 0, phi: 0},
      // {theta: PI / 10, phi: -PI / 3},
      // {theta: -PI / 10, phi: PI / 3},
      // {theta: -PI / 10, phi: -PI / 3},
    ];
      this.scenes = [
          createScene("stadium", "0 -3.639 0", "0.02 0.02 0.02"),
          createScene("king", "0 1.63 -8.3", "1 1 1"),
          createScene("bedroom1"),
      ];

    this.update = this.update.bind(this);
    this.onRaycasterIntersected = this.onRaycasterIntersected.bind(this);
    this.onRaycasterIntersectedCleared = this.onRaycasterIntersectedCleared.bind(this);
    this.onTriggerUp = this.onTriggerUp.bind(this);
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.getButtons = this.getButtons.bind(this);

    this.update();

    document.addEventListener("triggerdown", this.onTriggerDown);
    document.addEventListener("triggerup", this.onTriggerUp);
    document.addEventListener("raycaster-intersected", this.onRaycasterIntersected);
    document.addEventListener(
      "raycaster-intersected-cleared",
      this.onRaycasterIntersectedCleared,
    );
  }
  onRaycasterIntersected(e: CustomEvent) {
    this.setState({hoveredButton: e.detail.intersection.object.el.id});
  }
  onRaycasterIntersectedCleared(e: CustomEvent) {
    this.setState({hoveredButton: defaultState.hoveredButton});
  }
  onTriggerDown() {
    if (this.state.hoveredButton !== defaultState.hoveredButton) {
      const b = this.state.hoveredButton;
        const currentScene = parseInt(b[b.length - 1])
        console.log("currentscene", currentScene)
      this.setState({currentScene});
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
      const cart = sphericalToCartesian(theta, phi, 0.07);
      const id = `button${i}`;

      return (
        <a-sphere
          color="black"
          radius="0.005"
          position={`${cart.x} ${cart.y} ${cart.z}`}
          opacity={id === this.state.hoveredButton ? "1" : 0.3}
          key={i}
          class="torus-button"
          id={id}
          material="side: double"
        />
      );
    });
  }
  render() {
    const scene = this.scenes[this.state.currentScene];
      console.log(scene.name)
    return (
      <a-scene>
        <a-entity
          gltf-model={`url(./bloomaway/gltf/${scene.name}/scene.gltf)`}
        position={ scene.position }
        scale={ scene.scale}
        />
        <a-entity rotation="0 -90 0" scale="10 10 10" position="0 1.6 0">
            <a-entity
                gltf-model={`url(./torus/gltf/map.gltf)`}
            />
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
