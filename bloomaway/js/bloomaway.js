/**
 * @fileOverview
 * @name bloomaway.js
 * @author Nova Media LLC
 * @license TBD

 This is the main Bloomaway class.

 It handles instantiating a camera and its controls, a scene, the Torus, and mounts everything into the DOM with a render loop.

 TODO:
 - Take scenes as class parameter
 - Make a sky for outside scene. It's currently all black
 - Change scene when clicking on torus' map.
   + Detect user click on map
    - Setup raycaster: https://threejs.org/docs/#api/core/Raycaster
   + Update scene in callback
 - Refactor Torus in its own class
 */


class Bloomaway {
    constructor() {
        // Initialize attributes
        this.container = null
        this.camera = null
        this.controls = null
        this.scene = null
        this.renderer = null
        this.light = null
        this.gltf = null
        this.torus = {}

        // Bind functions
        this.init = this.init.bind(this)
        this.updateScene = this.updateScene.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initTorus = this.initTorus.bind(this)
        this.initDOM = this.initDOM.bind(this)
        this.initRenderer = this.initRenderer.bind(this)

        // Run
        this.init()
        this.animate()
    }
    init() {
        this.initDOM()
        this.initScene()
        this.initRenderer()
        this.initLight()
        this.camera = new Camera(this.scene)
        this.controls = new Controls(this.camera.getInstance(), this.scene)
        this.initTorus(this.scene, this.controls)
    }
    initDOM() {
        this.container = document.createElement('div')
        document.body.appendChild(this.container)
        window.addEventListener('resize', this.onWindowResize, false)

    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.gammaOutput = true
        this.container.appendChild(this.renderer.domElement)
    }
    initTorus(scene, controls) {
        this.torus = new Torus(scene, controls)

        this.torus.createButton(() => this.updateScene('bedroom1'), {
            position: new THREE.Vector3(-1.5, 0, 0),
            scale: 0.2,
        })

        this.torus.createButton(() => this.updateScene('king'), {
            position: new THREE.Vector3(-1.5, 1, 0),
            scale: 0.2,
            color: 0xff0000,
        })
    }
    updateScene(sceneName) {
        var selectedObject = this.scene.getObjectByName('scene')
        this.scene.remove(selectedObject)

        const cb = gltf => {
            this.gltf = gltf
            this.gltf.scene.name = 'scene'
            this.scene.add(this.gltf.scene)
        }

        getGltf(scenes[sceneName].name, cb, scenes[sceneName].options)

    }
    initScene() {
        this.scene = new THREE.Scene()

        this.updateScene('king')
    }
    initLight() {
        this.light = new THREE.HemisphereLight(0xbbbbff, 0x444422)
        this.light.position.set(0, 1, 0)
        this.scene.add(this.light)
    }
    onWindowResize() {
        this.camera.onWindowResize()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    animate() {
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera.getInstance())

        this.controls.update()
    }
}

window.bloomaway = new Bloomaway()
