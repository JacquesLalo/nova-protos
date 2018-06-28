/**
 * @fileOverview
 * @name bloomaway.js
 * @author Nova Media LLC
 * @license TBD

 This is the main Bloomaway class.

 It handles instantiating a camera and its controls, a scene, the Torus, and mounts everything into the DOM with a render loop.

 TODO:
 - Take scenes as class parameter
 - Make a sky for outside scene. It's currently all black
 */

import Camera from './camera.js'
import * as scenes from './sceneData.js'
import {
    getGltf,
    getObj,
} from './helpers.js'
import Controls from './controls.js'
import Torus from './torus.js'

class Bloomaway {
    constructor() {
        // Initialize attributes
        this.container = null
        this.camera = null
        this.controls = null
        this.scene = null
        this.renderer = null
        this.light = null
        this.torus = null

        // Bind functions
        this.init = this.init.bind(this)
        this.updateScene = this.updateScene.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initTorus = this.initTorus.bind(this)
        this.initDOM = this.initDOM.bind(this)
        this.initRenderer = this.initRenderer.bind(this)

        // Run
        this.init()
        this.animate()
    }
    init() {
        this.initDOM()
        this.initScene()
        this.initRenderer()
        this.initLight()
        this.camera = new Camera(this.scene)
        this.controls = new Controls(this.camera.getInstance(), this.scene)
        this.initTorus()
    }
    initDOM() {
        this.container = document.createElement('div')
        document.body.appendChild(this.container)
        window.addEventListener('resize', this.onWindowResize, false)

    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.gammaOutput = true
        this.container.appendChild(this.renderer.domElement)
    }
    /**
    * Instantiates a Torus and creates buttons allowing for changing scenes
    */
    initTorus() {
        this.torus = new Torus(this.scene, this.controls)

        this.torus.createButton(() => this.updateScene('bedroom1'), {
            position: new THREE.Vector3(-1.5, 0, 0),
            scale: 0.2,
        })

        this.torus.createButton(() => this.updateScene('king'), {
            position: new THREE.Vector3(-1.5, 1, 0),
            scale: 0.2,
            color: 0xff0000,
        })

        this.torus.createButton(() => this.updateScene('mall'), {
            position: new THREE.Vector3(-1, 1, 1),
            scale: 0.2,
            color: 0x0000ff,
        })
    }
    /**
    * Handles importing scenes defined in sceneData.js, it takes care of importing both GLTF and OBJ scene formats
    * TODO: optimize this function
    * @param {string} sceneName - Name of scene to import
    */
    updateScene(sceneName) {
        var selectedObject = this.scene.getObjectByName('scene')
        this.scene.remove(selectedObject)

        const cbGltf = gltf => {
            gltf.scene.name = 'scene'
            this.scene.add(gltf.scene)
        }

        const cbObj = object => {
            object.name = 'scene'
            this.scene.add(object)
        }

        const scene = scenes[sceneName]
        if(scene.format === 'gltf')
            getGltf(scene.name, cbGltf, scene.options)
        else
            getObj(scene.name, cbObj, scene.options)
    }
    initScene() {
        this.scene = new THREE.Scene()

        this.updateScene('king')
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

        this.controls.update()
    }
}

window.bloomaway = new Bloomaway()
