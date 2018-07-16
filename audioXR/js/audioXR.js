/*
  TODO: Currently, in the initTorus method, we initialize both the torus and the spherical visualier. We want to isolate the visalier in a new method initVisualier.

  TODO: isulate visualier in new class to be called form audioXR after initTorus.
*/
import Torus from '../../bloomaway/js/torus.js'
import Super from '../../bloomaway/js/super.js'
import Visualizer from '../../audioXR/js/visualizer.js'

class audioXR extends Super {
    constructor() {
        //calling Super constructor
        super()

        //initializing attributes
        this.uniforms = null
        this.displacement = null
        this.geometry = null
        this.plane = null
        this.torus = null
        this.visual = new Visualizer() //creating instance of Visualizer

        //bindings
        this.initTorus = this.initTorus.bind(this)
        this.animate = this.animate.bind(this)

        //calling init and super animate
        this.init()
        this.animate()
    }
    init() {
        super.init()
        this.initTorus()
        this.visual.init()

        //adding mesh to pur scene
        this.scene.add(this.visual.getPlane())

    }
    initTorus() {
        // Setup Torus
        this.torus = new Torus(this.scene, this.controls)


        this.torus.createButton(() => {}, {
            position: new THREE.Vector3(-1.5, 0, 0),
            scale: 0.5,
            shape: 'box',
        })
    }
    animate() {
        super.animate()
        //calling the render in Visualizer class
        this.visual.render()
    }
}
window.audioXR = new audioXR()
