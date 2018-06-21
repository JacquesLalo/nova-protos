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
        this.initTorus()
        this.initRenderer()
        this.initLight()
        this.camera = new Camera(this.scene)
        this.controls = new Controls(this.camera.getInstance(), this.scene)
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
        const cb = attrName => object => {
            this.scene.add(object)
            const d = {}
            d.geometry = object
            this.torus[attrName] = d
        }
        const getOptions = s => ({
            scale: {x: s, y: s, z: s},
        })

        const s = 20
        getObj('map/map', cb('map'), getOptions(s))
        getObj('ground/ground', cb('ground'), getOptions(s))
        getObj('shell/shell', cb('shell'), getOptions(0))

        var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} )
        var cube = new THREE.Mesh(geometry, material)
        cube.position.x = -1.5
        cb('cube')(cube)
        let i = true
        document.addEventListener('click', () => {
            if(this.controls.intersectObject(this.torus.cube.geometry).length) {
                cube.material = new THREE.MeshBasicMaterial( {color: i ? 0x00ff00 : 0x00ffff} )
                this.updateScene(i ? 'bedroom1' : 'king')
                i = !i
            }
        })
    }
    updateScene(sceneName = 'king') {
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

        const cb = gltf => {
            this.gltf = gltf
            this.gltf.scene.name = 'scene'
            this.scene.add(this.gltf.scene)
        }

        getGltf(scenes.king.name, cb, scenes.king.options)

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
