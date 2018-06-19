/**
 * @fileOverview
 * @name camera.js
 * @author Nova Media LLc
 * @license TBD

 This is our camera class for Bloomaway. It is what the user will see in VR.

 It also handles controlling the cameras from various inputs (VR controllers, mouse, keyboard, etc)

 TODO:
 - Make sane development camera controls. This is what we want: https://threejs.org/examples/?q=controls#misc_controls_pointerlock
   + Need to update Camera.initControls()
 - Hook it up with VR inputs (match headset positioning and track controllers)
 */

/**
 * Handles instantiating a THREE.js camera and hooking up controls to it with the DOM AP
 * @param {THREE.Scene} scene - Scene to mount camera into
 * @param {THREE.Renderer} renderer - Renderer to attach controls to
 */
class Camera {
    constructor(scene, renderer) {
        this.renderer = renderer
        this.scene = scene
        this.camera = null // private ; use this.getInstance() getter

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
    /**
    * Sets up camera controls
    */
    initControls() {
        this.controls = new THREE.FlyControls(this.camera)
        this.controls.movementSpeed = 1000
        this.controls.domElement = this.renderer.domElement
        this.controls.rollSpeed = Math.PI / 24
        this.controls.autoForward = false
        this.controls.dragToLook = false
        this.controls.movementSpeed = 0.33
    }
    /**
    * Method to call in onWindowResize DOM event to update camera on screen resizes.
    */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix()
    }
    /**
    * this.camera getter
    * @returns {THREE.Camera} THREE.js camera instance
    */
    getInstance() {
        return this.camera
    }
    /**
    * Callback to be called in Bloomaway render loop
    */
    animate() {
        this.controls.update(0.1)
    }
}
