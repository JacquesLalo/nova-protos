import * as THREE from 'three'

interface Uniforms {
    [s: string]: {
        value: number | THREE.Texture,
    },
}

class ShaderObject {
    uniforms: Uniforms
    material: THREE.ShaderMaterial
    mesh: THREE.Mesh
    geometry: THREE.BufferGeometry

    constructor(g: THREE.BufferGeometry, u: Uniforms, v: string, f: string) {
        this.uniforms = null

        this.updateUniforms = this.updateUniforms.bind(this)
        this.addAttribute = this.addAttribute.bind(this)
        this.init = this.init.bind(this)

        this.init(g, u, v, f)
    }
    init(g: THREE.BufferGeometry, u: Uniforms, v: string, f: string) {
        this.updateUniforms(u)
        this.geometry = g

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById(v).textContent,
            fragmentShader: document.getElementById(f).textContent,
            side: THREE.DoubleSide,
        })


        this.mesh = new THREE.Mesh(this.geometry, this.material)
    }
    addAttribute(n: string, a: THREE.BufferAttribute) {
        this.geometry.addAttribute(n, a)
    }
    updateUniforms(u: Uniforms) {
        this.uniforms = u
    }
}

export default ShaderObject
