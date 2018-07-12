import Super from '../../engine/super.js'
import { getObj } from '../../engine/helpers.js'

class InfiniteGallery extends Super {
    constructor() {
        // Calling Super constructor
        super()

        // Initializing attributes

        // Function bindings
        this.loadGalleryModels = this.loadGalleryModels.bind(this)
        this.initSky = this.initSky.bind(this)

        // Init
        this.init()
        super.animate()
    }
    init() {
        super.init()

        this.loadGalleryModels()
        this.initSky()
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
    }
}

window.infiniteGallery = new InfiniteGallery()
