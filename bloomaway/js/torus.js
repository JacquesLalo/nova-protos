class Torus {
    constructor(scene, controls) {
        this.scene = scene
        this.controls = controls
        this.torus = {
            buttons: [],
        }

        this.init = this.init.bind(this)
        this.createButton = this.createButton.bind(this)

        this.init()
    }
    init() {
        const cb = attrName => object => {
            this.scene.add(object)
            const d = {}
            d.geometry = object
            this.torus[attrName] = d
        }
        const getOptions = s => ({
            scale: {x: s, y: s, z: s},
        })

        const s = 20
        getObj('map/map', cb('map'), getOptions(s))
        getObj('ground/ground', cb('ground'), getOptions(s))
        getObj('shell/shell', cb('shell'), getOptions(0))

    }
    createButton(onClick, _options = {}) {
        const scale = _options.scale || 1
        const color = _options.color || 0x00ff00
        const position = _options.position || new THREE.Vector3(0, 0, 0)

        const geometry = new THREE.BoxGeometry(scale, scale, scale)
        const material = new THREE.MeshBasicMaterial({ color })
        const button = new THREE.Mesh(geometry, material)
        button.position.x = position.x
        button.position.y = position.y
        button.position.z = position.z

        this.scene.add(button)
        this.torus.buttons.push(button)

        document.addEventListener('click', () => {
            if(this.controls.intersectObject(button).length) {
                onClick(button)
            }
        })
    }
}
