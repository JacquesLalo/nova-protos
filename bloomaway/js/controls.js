/**
 * @fileOverview
 * @name controls.js
 * @author Nova Media LLc
 * @license TBD

 This is our user controls class for Bloomaway. It is how the user will control the camera. It currently uses a THREE.PointerLockControls instance binded to the camera to control it. Click the canvas to activate controls.

 Use arrow keys or A, S, D, W to move around and use the mouse to look around. They're basically FPS controls for now.

 This class provides a callback Controls.update() tho be called in the main render loop (Bloomaway.animate()) to update the camera

 TODO:
 - handle moving up and down with current controls
 - Hook it up with VR inputs (match headset positioning and track controllers)
*/

/**
 * Handles instantiating a THREE.PointerLockControls instance and hooking it up to the scene, camera, and DOM events
 * @param {THREE.Camera} camera - Camera to attach controls to
 * @param {THREE.Scene} scene - Scene to mount controls into
 */
class Controls {
    constructor(camera, scene) {
        this.controls = null
        this.camera = camera
        this.scene = scene

        this.controlsEnabled = true

        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false
        this.canJump = false

        this.prevTime = performance.now()
        this.velocity = new THREE.Vector3()
        this.direction = new THREE.Vector3()

        this.init = this.init.bind(this)
        this.initDOM = this.initDOM.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)

        this.init()
    }
    init() {
        this.controls = new THREE.PointerLockControls(this.camera)
        this.scene.add(this.controls.getObject())
        this.initDOM()
    }
    /**
    * Handles DOM event listeners. It binds and unbinds events by clicking or pressing escape respectively.
    */
    initDOM() {
        const element = document.body

        /* Mouse Events */
        const pointerlockchange = event => {
          if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            this.controlsEnabled = true
            this.controls.enabled = true
          } else {
            this.controls.enabled = false
            this.controlsEnabled = false
          }
        }
        var pointerlockerror = function (event) {
            console.log('pointer lock event error')
        }
        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false)

        element.addEventListener('click', function (event) {
          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
          element.requestPointerLock()
        }, false)

        /* KeyboardEvents */
        document.addEventListener('keydown', this.onKeyDown, false)
        document.addEventListener('keyup', this.onKeyUp, false)
    }
    /**
    * onKeyDown DOM event callback
    * @param {DOM event} event - event.keyCode contains information relative to keyboard key that was pressed
    */
    onKeyDown(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.moveForward = true
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = true
                break
            case 40: // down
            case 83: // s
                this.moveBackward = true
                break
            case 39: // right
            case 68: // d
                this.moveRight = true
                break
            case 32: // space
                if (this.canJump === true)
                    this.velocity.y += 350

                this.canJump = false
                break
        }
    }
    /**
     * onKeyUp DOM event callback
     * @param {DOM event} event - event.keyCode contains information relative to keyboard key that was released
     */
    onKeyUp(event) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                this.moveForward = false
                break
            case 37: // left
            case 65: // a
                this.moveLeft = false
                break
            case 40: // down
            case 83: // s
                this.moveBackward = false
                break
            case 39: // right
            case 68: // d
                this.moveRight = false
                break
        }
    }
    /**
     * Callback to be called in Bloomaway render loop
     */
    update() {
        if (this.controlsEnabled === true) {
          const time = performance.now()
          const delta = (time - this.prevTime) / 1000

          this.velocity.x -= this.velocity.x * 10.0 * delta
          this.velocity.z -= this.velocity.z * 10.0 * delta
          this.velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
          this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
          this.direction.x = Number(this.moveLeft) - Number(this.moveRight)
          this.direction.normalize() // this ensures consistent movements in all directions

          if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta
          if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta

          this.controls.getObject().translateX(this.velocity.x * delta)
          this.controls.getObject().translateY(this.velocity.y * delta)
          this.controls.getObject().translateZ(this.velocity.z * delta)

          if (this.controls.getObject().position.y < 10) {
            this.velocity.y = 0
            this.controls.getObject().position.y = 10
            this.canJump = true
          }
          this.prevTime = time
        }
    }
}
