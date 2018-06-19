class Bloomaway {
    constructor() {
        this.container = null
        this.controls = null
        this.camera = null
        this.scene = null
        this.renderer = null
        this.light = null
        this.gltf = null
        this.obj = []
        this.controls = null

        this.init = this.init.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.getObj = this.getObj.bind(this)
        this.getGltf = this.getGltf.bind(this)
        this.initCamera = this.initCamera.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initRenderer = this.initRenderer.bind(this)
        this.initControls = this.initControls.bind(this)

        this.init()
        this.animate()
        this.initControls()
    }
    initControls() {
        console.log('controls init')
        var onKeyDown = event => {
            console.log('hello')
					  switch ( event.keyCode ) {
						case 38: // up
						case 87: // w
                this.camera.position.set(this.camera.position.x + 1, 0, 0)
							  break;
						case 37: // left
						case 65: // a
                this.camera.position.set(0, this.camera.position.y - 1, 0)
                break;
						case 40: // down
						case 83: // s
                this.camera.position.set(this.camera.position.x - 1, 0, 0)
							  break;
						case 39: // right
						case 68: // d
                this.camera.position.set(0, this.camera.position.y + 1, 0)
							  break;
						case 32: // space
							  if ( canJump === true ) velocity.y += 350;
							  canJump = false;
							  break;
					  }
				};

        document.addEventListener('keydown', onKeyDown)
    }
    init() {
        // Bind to DOM
				this.container = document.createElement( 'div' );
				document.body.appendChild( this.container );
				window.addEventListener( 'resize', this.onWindowResize, false );

        this.initScene()
        this.initCamera()
        this.initLight()
        this.initRenderer()
    }
    initRenderer() {
				this.renderer = new THREE.WebGLRenderer( { antialias: true } );
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.gammaOutput = true;
				this.container.appendChild( this.renderer.domElement );
    }
    initScene() {
				this.scene = new THREE.Scene();

				// Models
        this.getObj('map/map', obj => obj.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0))
        this.getObj('ground/ground')
        this.getObj('shell/shell')
        // this.getGltf('bateau/scene')
    }
    initLight() {
				this.light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
				this.light.position.set( 0, 1, 0 );
				this.scene.add( this.light );
    }
    initCamera() {
				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
				this.camera.position.set(1, 0, 0);
        this.camera.lookAt(new THREE.Vector3(-1, 0, 0))
        this.scene.add( this.camera );
    }
    getGltf(name) {
        var loader = new THREE.GLTFLoader();
        loader.load( 'gltf/' + name + '.gltf', gltf => {
            this.gltf = gltf
            const s = 0.001
            this.gltf.scene.scale.set(s, s, s);
            this.gltf.scene.position.x = 0;				    //Position (x = right+ left-)
            this.gltf.scene.position.y = 0;				    //Position (y = up+, down-)
            this.gltf.scene.position.z = 0;
         	  this.scene.add( this.gltf.scene );
        } );
    }
    getObj(name, callback = () => {}) {
        const onProgress = () => {}
        const onError = e => {console.log(e)}
				new THREE.MTLLoader()
            .setPath( 'obj/' )
            .load( name + '.mtl', materials => {
                materials.preload();
                console.log(materials)
                new THREE.OBJLoader()
                    .setMaterials( materials )
                    .setPath( 'obj/' )
                    .load( name + '.obj', object => {
                        object.position.x = 0;
                        object.position.y = 0;
                        object.position.z = 0;

                        const s = 1
                        object.scale.set(s, s, s);

                        // object.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.2)

                        this.scene.add( object );
                        this.obj.push(object)

                        callback(object)
                    }, onProgress, onError );
            } );
    }
		onWindowResize() {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize( window.innerWidth, window.innerHeight );
		}
		animate() {
				requestAnimationFrame( this.animate );
        if(this.gltf)
            this.gltf.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.001)

				this.renderer.render( this.scene, this.camera );
		}
}

window.bloomaway = new Bloomaway()
