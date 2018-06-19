const defaultCb = () => {}
const defaultOnProgress = defaultCb
const defaultOnError = e => console.log(e)
const defaultOptions = {
    onError: defaultOnError,
    onProgress: defaultOnProgress,
    position: {
        x: 0,
        y: 0,
        z: 0,
    },
    scale: {
        x: 1,
        y: 1,
        z: 1,
    },
    rotation: {
        axis: new THREE.Vector3(1, 0, 0),
        angle: 0,
    }
}

const prepareOptions = options => {
    let _options

    if(options)
        _options = {
            ...defaultOptions,
            ...options,
        }
    else
        _options = defaultOptions

    return _options
}

const getObj = (name, callback = defaultCallback, _options) => {
    const options = prepareOptions(_options)

		new THREE.MTLLoader()
        .setPath('obj/')
        .load(name + '.mtl', materials => {
            materials.preload()
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('obj/')
                .load( name + '.obj', object => {
                    object.position.x = options.position.x
                    object.position.y = options.position.y
                    object.position.z = options.position.z
                    object.scale.set(options.scale.x, options.scale.y, options.scale.z)

                    callback(object)
                }, options.onProgress, options.onError)
        });
}

const getGltf = (name, cb = defaultCallback, _options) => {
    const options = prepareOptions(_options)

    const loader = new THREE.GLTFLoader()
    loader.load('gltf/' + name + '.gltf', gltf => {
        gltf.scene.scale.set(options.scale.x, options.scale.y, options.scale.z)
        gltf.scene.position.x = options.position.x
        gltf.scene.position.y = options.position.y
        gltf.scene.position.z = options.position.z
        gltf.scene.rotateOnAxis(options.rotation.axis, options.rotation.angle)

        cb(gltf)
    });
}
