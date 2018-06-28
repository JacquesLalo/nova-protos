var renderer, scene, camera
var uniforms
var displacement
var geometry, plane

init()
animate()

// Displaces calculates displacements for each vertices of a mesh
function applyDisplacements(displacement) {
    for (var i = 0; i < displacement.length; i++) {
        if(window.data && i % 2 === 0) {
            const x = window.data[i % window.data.length] / 128
            displacement[i] = 0.2 * Math.pow(x, 2)
        }
    }
}

function init() {
    // Camera setup
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 60
    camera.position.x = 5

    // Scene setup
    scene = new THREE.Scene()

    // Shader variables setup
    uniforms = {
        amplitude: {
            value: 10,
        },
        scaleFactor: {
            value: 1.0,
        },
        texture: {
            value: new THREE.TextureLoader().load('textures/about-us.png'),
        }
    }
    uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.MirroredRepeatWrapping
    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        side: THREE.DoubleSide,
    })

    // setting up the geometry
    // play with controls on: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
    geometry = new THREE.SphereBufferGeometry(5, 32, 32)

    // Deforming plane with displacements
    displacement = new Float32Array(geometry.attributes.position.count)
    applyDisplacements(displacement)

    // Setting up the shaders' attributes
    geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1))

    // Creating the mesh
    plane = new THREE.Mesh(geometry, shaderMaterial)

    // Adding the mesh to our scene
    scene.add(plane)

    // Rendering
    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    var container = document.getElementById('container')
    container.appendChild(renderer.domElement)

    // Event listeners
    window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
    requestAnimationFrame(animate)
    render()
}

function render() {
    var time = Date.now() * 0.001

    // Rotating and scaling plane wrt time
    plane.rotation.z = 0.5 * time
    plane.rotation.y = 0.5 * time
    uniforms.scaleFactor.value = 1 //0.5 * Math.sin(time)


    applyDisplacements(displacement)
    geometry.attributes.displacement.needsUpdate = true

    // Render
    renderer.render(scene, camera)
}
