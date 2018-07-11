/**
 * @fileOverview
 * @name Button.js
 * @author Nova Media LLC
 * @license TBD

 TODO:
 - allow for positioning button in spherical coords to they all lay on Torus
 - provide for more options

 TODO: We want that when you look at a TorusButton, it scales and becomes bigger but stays in position. It currently rotates and translates when you hover over it.

 This link can be helpful
 */

/**
 * Creates the boiler plate for creating other buttons. It handles everything in the button creation (including event subscriptions). However,
 *  all button geometry relative code should go in the inherited class.
 * @param {Controls} controls - Parameter description.
 * @param {function} onClick - callback to exectue on button click
 * @param {dict} _options - Transform options
 */
class AbstractButton {
    constructor(controls, onClick, _options = {}) {
        this.button = null // private, use getter
        this.onClick = onClick
        this.options = null
        this.controls = controls

        this.createGeometry = this.createGeometry.bind(this)
        this.init = this.init.bind(this)
        this.initEvents = this.initEvents.bind(this)
        this.initGeometry = this.initGeometry.bind(this)
        this.initOptions = this.initOptions.bind(this)
        this.clickEvent = this.clickEvent.bind(this)
        this.mouseMoveEvent = this.mouseMoveEvent.bind(this)
        this.getInstance = this.getInstance.bind(this)

        this.init(_options)
    }
    init(_options) {
        this.initOptions(_options)
        this.initGeometry(_options)
        this.initEvents()
    }
    initOptions(_options) {
        // Provide default options
        this.options = {
            rotation: {
                axis: _options.rotation.axis || new THREE.Vector3(0, 0, 0),
                angle: _options.rotation.angle || 0,
            },
            scale: _options.scale || 1,
            color: _options.color || 0x00ff00,
            position: _options.position || new THREE.Vector3(0, 0, 0),
            shape: _options.shape || 'box',
        }
    }

    initGeometry() {
        const geometry = this.createGeometry()

        geometry.scale.x = this.options.scale.x
        geometry.scale.y = this.options.scale.y
        geometry.scale.z = this.options.scale.z

        const material = new THREE.MeshBasicMaterial({ color: this.options.color })
        material.side = THREE.DoubleSide
        this.button = new THREE.Mesh(geometry, material)
        this.button.position.x = this.options.position.x
        this.button.position.y = this.options.position.y
        this.button.position.z = this.options.position.z

        const { axis, angle } = this.options.rotation
        this.button.rotateOnAxis(axis, angle)
    }

    initEvents() {
        document.addEventListener('click', this.clickEvent)
        document.addEventListener('mousemove', this.mouseMoveEvent)
    }
    clickEvent() {
        // Check for camera view / button intersection on user click
        if(this.controls.intersectObject(this.button).length) {
            this.onClick(this.button)
        }
    }
    mouseMoveEvent() {
        const { scale } = this.options

        if(this.controls.intersectObject(this.button).length) {
            this.button.scale.x = scale * 2
            this.button.scale.y = scale * 2
            this.button.scale.z = scale * 2
        } else {
            this.button.scale.x = scale
            this.button.scale.y = scale
            this.button.scale.z = scale
        }
    }
    getInstance() {
        return this.button // returns a THREE.mesh object
    }
}


/**
 * Class defining a Torus button
 * @param {THREE.Control} controls - THREE controls objects used for onClick callback
 * @param {function} onClick - Callback to execute on user click
 * @param {dict} _options - Button geometry options
 */
class SphereButton extends AbstractButton {
    constructor(controls, onClick, _options = {}) {
        super(controls, onClick, _options)
    }

    createGeometry() {
        return new THREE.SphereGeometry()
    }
}


class CubeButton extends AbstractButton {
    constructor(controls, onClick, _options = {}) {
        super(controls, onClick, _options)
    }

    createGeometry() {
        return new THREE.CubeGeometry()
    }
}

class TorusButton extends AbstractButton {
    constructor(controls, onClick, _options = {}) {
        super(controls, onClick, _options)
    }

    createGeometry() {
        return new THREE.SphereGeometry(1, 10, 10, 0, 2, 1, 1.4)
    }
}

export {
    SphereButton,
    CubeButton,
    TorusButton,
}
