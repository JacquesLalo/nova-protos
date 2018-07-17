/**
 * @fileOverview
 * @name nfl.ts
 * @author Nova Media LLc
 * @license TBD

 This file consists in 2 classes:
 - NFL which inherits from Super and setups up the stadium and the players
 - Player, which defines a player and associates an annotation

 TODO:
 - enhance Player.animate so it's better
 - Make it so that a player can be given an initial position, a target position, a speed and callback to annimate te player from one point to another. This will allow us to have plays by keeping a array of data for all players
 - refactor NFL.initSky to ../../engine/super.ts
*/

import * as THREE from 'three'

import Super from '../../engine/super'
import Controls from '../../engine/controls'
import { getObj, getGltf } from '../../engine/helpers'

class Player {
    controls: Controls
    scene: THREE.Scene
    handsUp: boolean
    player: THREE.Object3D
    annotation: THREE.Object3D
    constructor(scene: THREE.Scene, controls: Controls, handsUp = false) {
        this.controls = controls
        this.scene = scene
        this.handsUp = handsUp
        this.player = null
        this.annotation = null

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
        const cbAnnotation = obj => {
            obj.name = 'annotation'
            this.annotation = obj
            this.scene.add(obj)
        }

        const s = 4
        const options = {
            scale: {x: s, y: s, z: s},
            position: new THREE.Vector3(this.handsUp ? 30 : 1, -6, 0),
        }

        getObj('nfl/obj/player', 'Player-hands-' + (this.handsUp ? 'up' : 'down'), cbPlayer, options)
        getObj('nfl/obj/player', 'Player-sign', cbAnnotation, options)
    }
    animate() {
        const d = this.controls.getDistanceFrom(this.player)
        let s = 4 // scaling factor

        if(d > 10) { // scale and translate annotation if camera further than 10 from player
            s = s * 10 / d

            this.annotation.position.y = -6 * Math.pow(s / 4, 3)
        } else {
            this.annotation.position.y = -6
        }

        this.annotation.scale.x = s
        this.annotation.scale.y = s
        this.annotation.scale.z = s
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
