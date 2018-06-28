var renderer, scene, camera
var uniforms, plane
var displacement
var meshLengthSegments
var meshWidthSegments

init()
animate()

// Function to change uv mapping
function change_uvs(geometry, unitx, unity, offsetx, offsety) {
    var uvs = geometry.attributes.uv.array
    for (var i = 0; i < uvs.length; i += 2) {
        uvs[i] = (uvs[i] + offsetx) * unitx
        uvs[i + 1] = (uvs[i + 1] + offsety) * unity
    }
}

// Displaces calculates displacements for each vertices of a mesh
function applyDisplacements(displacement) {
    var x, y
    var alpha = 0.5
    var beta = alpha
    for (var i = 0; i < displacement.length; i++) {
        x = i / meshWidthSegments
        y = i % meshWidthSegments
        displacement[i] = 2 * Math.sin(alpha * x) * Math.sin(beta * y)
    }
}

function init() {
    // Camera setup
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 30
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
    })

    // setting up the geometry
    // play with controls on: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
    meshLengthSegments = 100
    meshWidthSegments = meshLengthSegments
    let meshWidth = 50
    let meshLength = meshWidth
    var geometry = new THREE.PlaneBufferGeometry(meshLength, meshWidth, meshLengthSegments, meshWidthSegments)

    // Changing uv mapping of current geometry
    change_uvs(geometry, 1, 1, 0, 0)

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

    // Event listeneres
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
    var time = Date.now() * 0.0001

    // Rotating and scaling plane wrt time
    plane.rotation.z = 0.5 * time
    uniforms.scaleFactor.value = 0.5 * Math.sin(time)

    // Render
    renderer.render(scene, camera)
}
