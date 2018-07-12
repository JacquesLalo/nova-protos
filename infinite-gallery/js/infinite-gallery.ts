import * as THREE from 'three'

import Super from '../../engine/super'
import { getObj } from '../../engine/helpers'

class InfiniteGallery extends Super {
    walkPath: THREE.QuadraticBezierCurve3
    userPosition: number // in [0, 1]
    isWalkingForward: boolean
    constructor() {
        // Calling Super constructor
        super()

        // Initializing attributes
        this.walkPath = null
        this.userPosition = 0
        this.isWalkingForward = false

        // Function bindings
        this.loadGalleryModels = this.loadGalleryModels.bind(this)
        this.initSky = this.initSky.bind(this)
        this.initMoveControls = this.initMoveControls.bind(this)

        // Init
        this.init()
        super.animate()
    }
    init() {
        super.init()

        this.loadGalleryModels()
        this.initSky()
        this.initMoveControls()
    }
    initMoveControls() {
        this.walkPath = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(50, 15, 0),
            new THREE.Vector3(50, 0, 0)
        )

        document.addEventListener('click', () => {
            this.isWalkingForward = !this.isWalkingForward
        })

        const points = this.walkPath.getPoints(50)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

        // Create the final object to add to the scene
        const curveObject = new THREE.Line(geometry, material)
        this.scene.add(curveObject)
    }
    initSky() {
        const scale = 100
        const skyGeometry = new THREE.SphereGeometry(
            scale,
            scale,
            scale
        )

        const loader = new THREE.TextureLoader()
        const onTextureLoad = texture => {
            // in this example we create the material when the texture is loaded
            const material = new THREE.MeshBasicMaterial({
                map: texture
            })

            material.side = THREE.DoubleSide
            const skyMesh = new THREE.Mesh(skyGeometry, material)
            this.scene.add(skyMesh)
        }
        const onError = () => {}
        const onProgress = () => {}

        // load a resource
        loader.load(
            'infinite-gallery/textures/sky.jpg',
            onTextureLoad,
            onProgress,
            onError,
        )


    }
    loadGalleryModels() {
        const cbObj = object => {
            object.name = 'gallery'
            this.scene.add(object)
        }

        const options = {
            position: new THREE.Vector3(0, 2, 0),
        }

        const loadModels = modelNames => modelNames.map(name => getObj('infinite-gallery/obj/gallery', name, cbObj, options))
        loadModels(['FloorIG', 'StructureIG', 'Wallgood1', 'Wallgood8', 'JoinIG'])
    }
    animate() {
        super.animate()

        if(this.isWalkingForward) {
            this.userPosition += 0.0001
        }

        const { x, y, z } =  this.walkPath.getPointAt(this.userPosition % 1)
        this.camera.getInstance().position.set(x, y, z)
    }
}

new InfiniteGallery()
