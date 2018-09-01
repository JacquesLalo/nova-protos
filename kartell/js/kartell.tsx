// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

const Model = (props: {
  isSelected: boolean;
  position: string;
  collisionBoxScale: string;
  collisionBoxPosition: string;
    color: string;
  id: string;
    scale: string;
    src: string;
    rotation: string;
    modelPosition: string;
}) => (
    <a-entity
        id={props.id}
        rotation={props.rotation}
        position={props.position}>
    <a-obj-model
    scale={props.scale}
    src={props.src}
    position={props.modelPosition}
      material={"color: " + (props.isSelected ? "green" : props.color)}
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
        color: string,
        rotationY: number,
        modelPosition: string,
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
          color: "gray",
          rotationY: 0,
          modelPosition: "0 0 0",
      },
      {
          position: new THREE.Vector3(-2.6, 0, -2.6),
          src: "./kartell/obj/kartell/invisible_table.obj",
          scale: "1 1 1",
          collisionBoxPosition: "0.283 0.386 1.650",
          collisionBoxScale: "1.137 0.739 1.104",
          color: "brown",
          rotationY: 0,
          modelPosition: "0 0.584 0",
      },
      {
          position: new THREE.Vector3(3.497, 0, -1.036),
          src: "./kartell/obj/kartell/kartell_couch.obj",
          scale: "1 1 1",
          collisionBoxPosition: "-0.534 0.345 0.113",
          collisionBoxScale: "3.062 0.739 1.104",
          color: "brown",
          rotationY: 90,
          modelPosition: "0 0 0",
      },
      {
          position: new THREE.Vector3(2.899, 0, 2.141),
          src: "./kartell/obj/kartell/kartell_couch.obj",
          scale: "1 1 1",
          collisionBoxPosition: "-0.534 0.345 0.113",
          collisionBoxScale: "3.062 0.739 1.104",
          color: "brown",
          rotationY: 0,
          modelPosition: "0 0 0",
      },
      // {
      //     position: new THREE.Vector3(2.899, 0, 2.141),
      //     src: "./kartell/obj/couch.obj",
      //     scale: "0.029 0.029 0.029",
      //     collisionBoxPosition: "0.399 0.726 0",
      //     collisionBoxScale: "3.236 1.412 1.655",
      //     color: "brown",
      //     rotationY: 0,
      //     modelPosition: "0 0 0",
      // },
      {
          position: new THREE.Vector3(0, 0, 0),
          src: "./kartell/obj/kartell/stark_table.obj",
          scale: "1 1 1",
          collisionBoxPosition: "0.9 0.264 -0.036",
          collisionBoxScale: "1.297 1 1.362",
          color: "brown",
          rotationY: 0,
          modelPosition: "0 0.195 0",
      },
      {
          position: new THREE.Vector3(-0.56, 0, -1.026),
          src: "./kartell/obj/kartell/madame_3d_stark.obj",
          scale: "0.1 0.1 0.1",
          collisionBoxPosition: "0 0.314 -0.036",
          collisionBoxScale: "0.724 1.001 0.716",
          color: "brown",
          rotationY: 0,
          modelPosition: "0 0 0",
      },
      {
          position: new THREE.Vector3(0.56, 0, -1.026),
          src: "./kartell/obj/kartell/madame_3d_stark.obj",
          scale: "0.1 0.1 0.1",
          collisionBoxPosition: "0 0.314 -0.036",
          collisionBoxScale: "0.724 1.001 0.716",
          color: "brown",
          rotationY: 90,
          modelPosition: "0 0 0",
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
            const { models } = this.state
            const modelId = parseInt(this.state.currentModelId[this.state.currentModelId.length - 1])
            const model = models[modelId]
            const delta = 5
          if (x > 0.5) {
            // rotate around positive Y axis
              model.rotationY = (model.rotationY + delta) % 360
              this.setState({ models })
          } else if (x < -0.5) {
            // rotate around negative Y axis
              model.rotationY = (model.rotationY - delta) % 360
              this.setState({ models })
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

        const modelPosition = raycasterDirection
          .normalize()
          .multiplyScalar(this.modelDistance);

        const modelId = parseInt(this.state.currentModelId[this.state.currentModelId.length - 1])
        const models = this.state.models.slice()
          models[modelId] = {
              ...models[modelId],
              position: modelPosition,
          }

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
              modelPosition={m.modelPosition}
              rotation={`0 ${m.rotationY} 0`}
              color={m.color}
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
