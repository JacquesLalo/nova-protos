import Super from '../../engine/super.js'

class InfiniteGallery extends Super {
    constructor() {
        //calling Super constructor
        super()

        //initializing attributes

        //bindings

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
