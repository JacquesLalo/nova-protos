/*
  TODO: Currently, in the initTorus method, we initialize both the torus and the spherical visualier. We want to isolate the visalier in a new method initVisualier.

  TODO: isulate visualier in new class to be called form audioXR after initTorus.
*/

import * as THREE from 'three'

import Torus from '../../torus/js/torus.ts'
import Super from '../../engine/super.ts'
import ShaderObject from '../../engine/shaderObject.ts'

import './audio.js'

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

        //bindings
        this.applyDisplacements = this.applyDisplacements.bind(this)
        this.render = this.render.bind(this)
        this.initTorus = this.initTorus.bind(this)
        this.initVisualizer = this.initVisualizer.bind(this)

        this.init()
        super.animate()
    }
    init() {
        super.init()
        this.initTorus()
        this.initVisualizer()
    }
    initVisualizer() {
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

        // setting up the geometry
        this.geometry = new THREE.SphereBufferGeometry(0.1, 32, 32)

        // Deforming plane with displacements
        this.displacement = new Float32Array(this.geometry.attributes.position.count)
        this.applyDisplacements(this.displacement)

        // Creating the mesh
        this.visualizer = new ShaderObject(this.geometry, this.uniforms, 'vertexshader', 'fragmentshader')
        this.visualizer.addAttribute('displacement', new THREE.BufferAttribute(this.displacement, 1))
        this.visualizer.mesh.position.y = 3
        this.visualizer.mesh.position.x = 3

        // Adding the mesh to our scene
        this.scene.add(this.visualizer.mesh)
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
        this.visualizer.mesh.rotation.z = 0.5 * time
        this.visualizer.mesh.rotation.y = 0.5 * time
        this.uniforms.scaleFactor.value = 1

        this.applyDisplacements(this.displacement)
        this.geometry.attributes.displacement.needsUpdate = true
    }
}

window.audioXR = new audioXR()
