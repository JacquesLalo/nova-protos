class Camera {
    constructor(scene, renderer) {
        this.renderer = renderer
        this.scene = scene
        this.camera = null

        this.init = this.init.bind(this)
        this.initControls = this.initControls.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.getInstance = this.getInstance.bind(this)
        this.animate = this.animate.bind(this)

        this.init()
    }
    init() {
				this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 40)
				this.camera.position.set(0, 0, 0)
        this.camera.lookAt(new THREE.Vector3(-1, 0, 0))
        this.scene.add(this.camera)

        this.initControls()
    }
    initControls() {
        this.controls = new THREE.FlyControls(this.camera)
				this.controls.movementSpeed = 1000
				this.controls.domElement = this.renderer.domElement
				this.controls.rollSpeed = Math.PI / 24
				this.controls.autoForward = false
				this.controls.dragToLook = false
				this.controls.movementSpeed = 0.33
    }
		onWindowResize() {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix()
		}
    getInstance() {
        return this.camera
    }
    animate() {
				this.controls.update(0.1)
    }
}
