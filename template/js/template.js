import Super from '../../engine/super.js'

class Template extends Super {
    constructor() {
        // Calling Super constructor
        super()

        // Initializing attributes

        // Method bindings

        // Init code
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

window.template = new Template()
