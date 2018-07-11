import Super from '../../engine/super.js'
import { getObj } from '../../engine/helpers.js'

class InfiniteGallery extends Super {
    constructor() {
        // Calling Super constructor
        super()

        // Initializing attributes

        // Function bindings
        this.loadGalleryModels = this.loadGalleryModels.bind(this)

        // Init
        this.init()
        super.animate()
    }
    init() {
        super.init()

        this.loadGalleryModels()
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
