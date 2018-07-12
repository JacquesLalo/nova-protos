/*
  TODO: Currently, in the initTorus method, we initialize both the torus and the spherical visualier. We want to isolate the visalier in a new method initVisualier.

  TODO: isulate visualier in new class to be called form audioXR after initTorus.
*/

import * as THREE from 'three'

import Torus from '../../torus/js/torus.js'
import Super from '../../engine/super.js'

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

        this.init()
        super.animate()
    }
    init() {
        super.init()
        this.initTorus()
    }
    initTorus() {
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
    }
}

window.audioXR = new audioXR()
