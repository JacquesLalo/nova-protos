/**
 * @fileOverview
 * @name bloomaway.js
 * @author Nova Media LLC
 * @license TBD

 This is the main Bloomaway class.

 It handles instantiating a camera and its controls, a scene, the Torus, and mounts everything into the DOM with a render loop.

 TODO:
 - Take scenes as class parameter
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
        this.scene = null
        this.renderer = null
        this.light = null
        this.gltf = null
        this.torus = {}

        // Bind functions
        this.init = this.init.bind(this)
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
        this.initTorus()
        this.initRenderer()
        this.initLight()
        this.camera = new Camera(this.scene, this.renderer)
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
    initTorus() {
        const options = {scale: {x: 2, y: 2, z: 2}}
        const cb = attrName => object => {
            this.scene.add(object)
            const d = {}
            d.geometry = object
            this.torus[attrName] = d
        }

        getObj('map/map', cb('map'), options)
        getObj('ground/ground', cb('ground'), options)
        getObj('shell/shell', cb('shell'), options)
    }
    initScene() {
        this.scene = new THREE.Scene()

        const s = 0.001
        const options = {
            scale: {
                x: s,
                y: s,
                z: s,
            },
            rotation: {
                axis: new THREE.Vector3(0, 1, 0),
                angle: Math.PI / 2,
            },
            position: {
                x: -5,
                y: 21,
                z: 9
            }
        }
        const cb = gltf => {
            this.gltf = gltf
            this.scene.add(this.gltf.scene)
        }
        getGltf('bateau/scene', cb, options)

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

        this.camera.animate()
    }
}

window.bloomaway = new Bloomaway()
