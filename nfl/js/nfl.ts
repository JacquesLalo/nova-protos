import * as THREE from 'three'

import Super from '../../engine/super'
import Controls from '../../engine/controls'
import { getObj, getGltf } from '../../engine/helpers'

class Player {
    controls: Controls
    scene: THREE.Scene
    handsUp: boolean
    player: THREE.Object3D
    sign: THREE.Object3D
    constructor(scene: THREE.Scene, controls: Controls, handsUp = false) {
        this.controls = controls
        this.scene = scene
        this.handsUp = handsUp
        this.player = null
        this.sign = null

        this.init = this.init.bind(this)
        this.animate = this.animate.bind(this)
        this.loadPlayer = this.loadPlayer.bind(this)

        this.init()
    }
    init() {
        this.loadPlayer()
    }
    loadPlayer() {
        const cbPlayer = obj => {
            obj.name = 'player'
            this.player = obj
            this.scene.add(obj)
        }
        const cbSign = obj => {
            obj.name = 'sign'
            this.sign = obj
            this.scene.add(obj)
        }

        const s = 4
        const options = {
            scale: {x: s, y: s, z: s},
            position: new THREE.Vector3(this.handsUp ? 30 : 1, -6, 0),
        }

        getObj('nfl/obj/player', 'Player-hands-' + (this.handsUp ? 'up' : 'down'), cbPlayer, options)
        getObj('nfl/obj/player', 'Player-sign', cbSign, options)
    }
    animate() {
        const d = this.controls.getDistanceFrom(this.sign)
        let s = 4
        if(d > 10) {
            s = s * 10 / d

            this.sign.position.y = -6 * Math.pow(s / 4, 3)
        } else {
            this.sign.position.y = -6
        }

        this.sign.scale.x = s
        this.sign.scale.y = s
        this.sign.scale.z = s
    }
}

class NFL extends Super {
    players: Array<Player>
    constructor() {
        // Calling Super constructor
        super()

        // Initializing attributes
        this.players = []

        // Function bindings
        this.loadStadium = this.loadStadium.bind(this)
        this.initSky = this.initSky.bind(this)

        // Init
        this.init()
        super.animate()
    }
    init() {
        super.init()

        this.loadStadium()
        this.initSky()
        this.players.push(new Player(this.scene, this.controls))
        this.players.push(new Player(this.scene, this.controls, true))
    }
    initSky() {
        const scale = 500
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
    loadStadium() {
        const cb = gltf => {
            gltf.name = 'stadium'
            this.scene.add(gltf.scene)
        }

        const options = {
            scale: {x: 0.1, y: 0.1, z: 0.1},
            position: new THREE.Vector3(0, -23, 0),
        }

        getGltf('nfl/gltf/stadium', 'scene', cb, options)
    }
    animate() {
        super.animate()
        this.players.map(p => p.animate())
    }
}

const a = new NFL()
console.log(a)
