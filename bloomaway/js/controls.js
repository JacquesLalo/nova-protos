/**
 * @fileOverview
 * @name controls.js
 * @author Nova Media LLc
 * @license TBD

 This is our user controls class for Bloomaway. It is how the user will control the camera. It currently uses a THREE.FlyControls instance binded to the camera to control it. It's not very good...

 TODO:
 - Make sane development camera controls. This is what we want: https://threejs.org/examples/?q=controls#misc_controls_pointerlock
 + Need to update Controls.init()
 - Hook it up with VR inputs (match headset positioning and track controllers)
*/

class Controls {
    constructor(camera, renderer) {
        this.controls = null
        this.camera = camera
        this.renderer = renderer

        this.init = this.init.bind(this)

        this.init()
    }
    init() {
        this.controls = new THREE.FlyControls(this.camera)
        this.controls.movementSpeed = 1000
        this.controls.domElement = this.renderer.domElement
        this.controls.rollSpeed = Math.PI / 24
        this.controls.autoForward = false
        this.controls.dragToLook = false
        this.controls.movementSpeed = 0.33
    }
    /**
     * Callback to be called in Bloomaway render loop
     */
    update() {
        this.controls.update(0.1)
    }
}
