// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

const Model = (props: {
  isSelected: boolean;
  position: string;
  collisionBoxScale: string;
  collisionBoxPosition: string;
  id: string;
    scale: string;
    src: string;
}) => (
        <a-entity id={props.id} position={props.position}>
    <a-obj-model
    scale={props.scale}
    src={props.src}
      material={"color: " + (props.isSelected ? "red" : "green")}
    />
    <a-entity
      class="collidable"
      geometry="primitive: box"
      material={
        "color: rgba(0, 0, 0); opacity: " + (props.isSelected ? "0.3" : "0.0")
      }
      scale={props.collisionBoxScale}
      position={props.collisionBoxPosition}
    />
  </a-entity>
);

export interface AppState {
  triggerDown: boolean;
  intersection: boolean;
  currentModelId: string;
    models: Array<{
        position: THREE.Vector3,
        src: string,
        scale: string,
        collisionBoxPosition: string,
        collisionBoxScale: string,
    }>;
}

const defaultState = {
  triggerDown: false,
  intersection: false,
  currentModelId: "",
  models: [
      {
          position: new THREE.Vector3(1.85, 0, -1.57),
          src: "./kartell/obj/chair.obj",
          scale: "0.013 0.013 0.013",
          collisionBoxPosition: "0 0.55 0",
          collisionBoxScale: "00.85 1.171 0.8",
      },
      {
          position: new THREE.Vector3(2.899, 0, 2.141),
          src: "./kartell/obj/couch.obj",
          scale: "0.029 0.029 0.029",
          collisionBoxPosition: "0.399 0.726 0",
          collisionBoxScale: "3.236 1.412 1.655",
      },
  ],
};

class App extends React.Component<{}, AppState> {
  raq: number;
  modelDistance: number;
  modelPointOfIntersection: THREE.Vector3;
  offset: THREE.Vector3;
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.modelDistance = 0;
    this.modelPointOfIntersection = new THREE.Vector3(0, 0, 0);
    this.offset = new THREE.Vector3(0, 0, 0);

    this.update = this.update.bind(this);
    this.isSelected = this.isSelected.bind(this);

    this.update();

    document.addEventListener("thumbstickmoved", (e: CustomEvent) => {
      const {x, y} = e.detail;
      if (this.isSelected()) {
        if (Math.abs(x) < 0.5) {
          if (y < -0.5) this.modelDistance += 0.1;
          else if (y > 0.5) this.modelDistance -= 0.1;
        } else if (Math.abs(y) < 0.5) {
          if (x > 0.5) {
            // rotate around positive Y axis
          } else if (x < -0.5) {
            // rotate around negative Y axis
          }
        }
      }
    });

    document.addEventListener("triggerdown", () => {
      this.setState({triggerDown: true});

      const raycaster = AFRAME.scenes[0].querySelector("[raycaster]").components
        .raycaster;
      raycaster.refreshObjects();

        for(let i in this.state.models) {
            const modelId = `model${i}`
            const model = AFRAME.scenes[0].querySelector(`#${modelId} > .collidable`).object3D;
            const intersections = raycaster.raycaster.intersectObject(model, true);
            console.log(intersections)
            if (intersections.length) {
                const intersection = intersections[0];
                this.modelDistance = intersection.distance;
                this.modelPointOfIntersection = intersection.point;
                this.offset = new THREE.Vector3(
                    model.position.x - intersection.point.x,
                    model.position.y - intersection.point.y,
                    model.position.z - intersection.point.z,
                );

                this.setState({intersection: true, currentModelId: modelId});
            }
        }

    });

    document.addEventListener("triggerup", () => {
        this.setState({triggerDown: false, intersection: false, currentModelId: defaultState.currentModelId});
    });

  }

  update() {
    this.raq = requestAnimationFrame(() => {
      if (this.isSelected()) {
        const raycasterDirection = AFRAME.scenes[0]
          .querySelector("[raycaster]")
          .components.raycaster.raycaster.ray.direction.clone();
        //raycasterDirection.sub(this.offset);

        const modelPosition = raycasterDirection
          .normalize()
          .multiplyScalar(this.modelDistance);

        const modelId = parseInt(this.state.currentModelId[this.state.currentModelId.length - 1])
        const models = this.state.models.slice()
        models[modelId] = {position: modelPosition}

        this.setState({models})
      }
      this.update();
    });
  }
  isSelected() {
    return this.state.triggerDown && this.state.intersection;
  }
  render() {
      const models = this.state.models.map((m, i) => {
          const id = `model${i}`
          const isSelected = this.state.currentModelId === id
          const position =
              m.position.x +
              " " +
              (isSelected ? 0.1 : 0) +
              " " +
              m.position.z;

          return (
              <Model
                key={i}
                id={id}
                position={position}
              collisionBoxPosition={m.collisionBoxPosition}
              collisionBoxScale={m.collisionBoxScale}
                isSelected={isSelected}
                scale={m.scale}
                src={m.src}
                />
          )
      })

    return (
      <a-scene>
        <a-obj-model
          src="./kartell/obj/kartell-room.obj"
          mtl="./kartell/obj/kartell-room.mtl"
        />
            { models }
        <a-obj-model
          id="collision-box"
          src="./kartell/obj/Collision.obj"
          mtl="./kartell/obj/Collision.mtl"
          scale="0.9 0.9 0.9"
          visible="false"
        />
        <a-sky color="#ECECEC" />
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
