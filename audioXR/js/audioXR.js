/*
  TODO: Md, I've imported our Super class in setup the boiler plate so you can call it from this file.

  I'm going to need you guys to refactor the AudioXR class to inherit from the Super class please. You will need to:
  - remove all code that is redunant with that of the Super class
  - keep all code specific to audioXR in this file

  After this is done, you will finish refactoring audioXR's init method so that all torus setup code is in a new audioXR method called initTorus (similar to how the Bloomaway class is setup)

  This will allow you for example to inherit the animate method from Super in audioXR and call audioXR's render in it.
*/
import Controls from '../../bloomaway/js/controls.js'
import Torus from '../../bloomaway/js/torus.js'
import Super from '../../bloomaway/js/super.js'

class audioXR extends Super {
    constructor() {

        //calling Super constructor
        super()
        //initializing attributes

        //this.renderer = null
        //this.scene = null
        //this.camera = null
        this.uniforms = null
        this.displacement = null
        this.geometry = null
        this.plane = null
        this.torus = null
        //this.controls = null

        //bindings
        
        //this.init = this.init.bind(this)
        //this.animate = this.animate.bind(this)
        this.applyDisplacements = this.applyDisplacements.bind(this)
        //this.onWindowResize = this.onWindowResize.bind(this)
        this.render = this.render.bind(this)



    }
    init() {
        super.init()
        
        // Setup Torus
 
        this.torus = new Torus(this.scene, this.controls)


        this.torus.createButton(() => {}, {
            position: new THREE.Vector3(-1.5, 0, 0),
            scale: 0.5,
            shape: 'box',
        })

        // Shader variables setup
        this.uniforms = {
            amplitude: {
                value: 10,
            },
            scaleFactor: {
                value: 1.0,
            },
            texture: {
                value: new THREE.TextureLoader().load('audioXR/textures/about-us.png'),
            }
        }
        this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.MirroredRepeatWrapping
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            side: THREE.DoubleSide,
        })

        // setting up the geometry
        // play with controls on: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
        this.geometry = new THREE.SphereBufferGeometry(0.1, 32, 32)

        // Deforming plane with displacements
        this.displacement = new Float32Array(this.geometry.attributes.position.count)
        this.applyDisplacements(this.displacement)

        // Setting up the shaders' attributes
        this.geometry.addAttribute('displacement', new THREE.BufferAttribute(this.displacement, 1))

        // Creating the mesh
        this.plane = new THREE.Mesh(this.geometry, shaderMaterial)
        this.plane.position.y = 3
        this.plane.position.x = 3

        // Adding the mesh to our scene
        this.scene.add(this.plane)

        // Rendering
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        const container = document.getElementById('container')
        container.appendChild(this.renderer.domElement)

        // Event listeners
        window.addEventListener('resize', this.onWindowResize, false)
    }
    applyDisplacements(displacement) {
        for (let i = 0; i < displacement.length; i++) {
            if(window.data && i % 2 === 0) {
                const x = window.data[i % window.data.length] / 128
                displacement[i] = 0.2 * Math.pow(x, 2)
            }
        }
    }
    animate() {
        super.animate()
        this.render()
    }
    render() {
        const time = Date.now() * 0.001

        // Rotating and scaling plane wrt time
        this.plane.rotation.z = 0.5 * time
        this.plane.rotation.y = 0.5 * time
        this.uniforms.scaleFactor.value = 1

        this.applyDisplacements(this.displacement)
        this.geometry.attributes.displacement.needsUpdate = true

        // Render
        this.renderer.render(this.scene, this.camera)
    }
}

window.audioXR = new audioXR()
