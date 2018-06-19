class Bloomaway {
    constructor() {
        this.container = null
        this.camera = null
        this.scene = null
        this.renderer = null
        this.light = null
        this.gltf = null
        this.obj = []

        this.init = this.init.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initRenderer = this.initRenderer.bind(this)

        this.init()
        this.animate()
    }
    init() {
        // Bind to DOM
				this.container = document.createElement('div')
				document.body.appendChild(this.container)
				window.addEventListener('resize', this.onWindowResize, false)

        this.initScene()
        this.initRenderer()
        this.initLight()
        this.camera = new Camera(this.scene, this.renderer)
    }
    initRenderer() {
				this.renderer = new THREE.WebGLRenderer({ antialias: true })
				this.renderer.setPixelRatio(window.devicePixelRatio)
				this.renderer.setSize(window.innerWidth, window.innerHeight)
				this.renderer.gammaOutput = true
				this.container.appendChild(this.renderer.domElement)
    }
    initScene() {
				this.scene = new THREE.Scene()

				// Scene
        const s = 0.001
        const sceneOptions = {
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
        const sceneCb = gltf => {
            this.gltf = gltf
            this.scene.add(this.gltf.scene)
        }
        getGltf('bateau/scene', sceneCb, sceneOptions)

        // UI
        const options = {scale: {x: 2, y: 2, z: 2}}
        const cb = object => {
            this.scene.add(object)
            this.obj.push(object)
        }

        getObj('map/map', cb, options)
        getObj('ground/ground', cb, options)
        getObj('shell/shell', cb, options)
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
