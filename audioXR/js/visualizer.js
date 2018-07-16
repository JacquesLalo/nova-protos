class Visualizer{
    constructor(){

        //declaring attributes
        this.uniforms = null
        this.geometry = null
        this.plane = null
        this.displacement = null
        this.shaderMaterial = null

        //binding
        this.init = this.init.bind(this)
        this.initGeometry = this.initGeometry.bind(this)
        this.inituniforms = this. inituniforms.bind(this)
        this.applyDisplacements = this.applyDisplacements.bind(this)
        this.deformPlane = this.deformPlane.bind(this)
        this.getPlane = this.getPlane.bind(this)
    }
    init(){
        this.inituniforms()
        //creating shader Materials
        this.shaderMaterial= new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            side: THREE.DoubleSide,
        })
        this.initGeometry()
        this.createMesh()

    }
    inituniforms(){

        //innitializing uniforms for shaders
        this.uniforms = {
            amplitude: {
                value: 10,
            },
            scaleFactor: {
                value: 1.0,
            },
            texture: {
                value: new THREE.TextureLoader().load('audioXR/textures/about-us.png'),
            }
        }
        this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.MirroredRepeatWrapping
    }
    initGeometry(){
        // setting up the geometry
        // play with controls on: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
        this.geometry = new THREE.SphereBufferGeometry(0.1, 32, 32)
        this.displacement = new Float32Array(this.geometry.attributes.position.count)
        this.deformPlane() //deforming plane with displacement
        this.geometry.addAttribute('displacement', new THREE.BufferAttribute(this.displacement, 1))
    }
    createMesh(){
        //creates mesh
        this.plane = new THREE.Mesh(this.geometry, this.shaderMaterial)
        this.plane.position.y = 3
        this.plane.position.x = 3
    }
    deformPlane(){
        //applies displacement to the plane from sound freq.
        this.applyDisplacements(this.displacement)
    }
    applyDisplacements(displacement) {
        for (let i = 0; i < displacement.length; i++) {
            if(window.data && i % 2 === 0) {
                const x = window.data[i % window.data.length] / 128
                displacement[i] = 0.2 * Math.pow(x, 2)
            }
        }
    }
    getPlane(){
        //returns plane
        return this.plane
    }
    render() {
        const time = Date.now() * 0.001

        // Rotating and scaling plane wrt time
        this.plane.rotation.z = 0.5 * time
        this.plane.rotation.y = 0.5 * time
        this.uniforms.scaleFactor.value = 1

        this.deformPlane()
        this.geometry.attributes.displacement.needsUpdate = true
    }
}
export default Visualizer