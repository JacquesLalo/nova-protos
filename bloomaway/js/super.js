class Super {
    constructor(foo) {
        console.log('super class instancing')
        this.foo = foo

        // bindings
        this.init = this.init.bind(this)
        this.updateScene = this.updateScene.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initDOM = this.initDOM.bind(this)
        this.initRenderer = this.initRenderer.bind(this)
    }
    init() {
    }
    initDOM() {
    }
    initRenderer() {
    }
    initScene() {
    }
    initLight() {
    }
    onWindowResize() {
    }
    animate() {
    }
}

export default Super
