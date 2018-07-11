import Super from '../../engine/super.js'

class InfiniteGallery extends Super {
    constructor() {
        // Calling Super constructor
        super()

        // Initializing attributes

        // Function bindings

        // Init
        this.init()
        super.animate()
    }
    init() {
        super.init()
    }
    animate() {
        super.animate()
    }
}

window.infiniteGallery = new InfiniteGallery()
