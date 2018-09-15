// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

export interface AppState {}

const defaultState = {};

class App extends React.Component<{}, AppState> {
  raq: number;
  modelDistance: number;
  modelPointOfIntersection: THREE.Vector3;
  offset: THREE.Vector3;
  constructor(props) {
    super(props);
  }

  update() {}
  isSelected() {}
  render() {
    return (
      <a-scene>
        <a-obj-model
          src="./XR-medical/obj/models/Body1.obj"
          mtl="./XR-medical/obj/models/Body1.mtl"
          position="0 2 0"
        />

        <a-obj-model
          src="./XR-medical/obj/torus/Torus1.obj"
          material="side: double; color: black; opacity: 0.1; transparent: true"
          position="0 0.5 0"
        />
        <a-obj-model
          src="./XR-medical/obj/torus/Arrow.obj"
          mtl="./XR-medical/obj/torus/Arrow.mtl"
          rotation="90 0 0"
        />
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
