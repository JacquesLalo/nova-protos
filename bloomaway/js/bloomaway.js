class Bloomaway {
    constructor() {
        this.container = null
        this.controls = null
        this.camera = null
        this.scene = null
        this.renderer = null
        this.light = null
        this.gltf = null
        this.obj = null
        this.controls = null

        this.init = this.init.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)

        this.init()
        this.animate()
    }

    init() {
				this.container = document.createElement( 'div' );
				document.body.appendChild( this.container );
				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
				this.scene = new THREE.Scene();
				this.light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
				this.light.position.set( 0, 1, 0 );
				this.scene.add( this.light );


        var loader = new THREE.GLTFLoader();
        loader.load( 'gltf/bateau/scene.gltf', gltf => {
             this.gltf = gltf
             const s = 0.001
             this.gltf.scene.scale.set(s, s, s);
             this.gltf.scene.position.x = 0;				    //Position (x = right+ left-)
             this.gltf.scene.position.y = 0;				    //Position (y = up+, down-)
             this.gltf.scene.position.z = 0;
         	   this.scene.add( this.gltf.scene );
        } );

				// model
        const onProgress = () => {}
        const onError = () => {}
				new THREE.MTLLoader()
            .setPath( 'obj/' )
            .load( 'torus.mtl', function ( materials ) {
                materials.preload();
                new THREE.OBJLoader()
                    .setMaterials( materials )
                    .setPath( 'obj/' )
                    .load( 'torus.obj', function ( object ) {
                        object.position.x = 0;
                        object.position.y = 0;
                        object.position.z = 0;

                        const s = 0.1
                        object.scale.set(s, s, s);

                        object.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.2)

                        this.scene.add( object );
                        this.obj = object
                    }, onProgress, onError );
            } );

				this.renderer = new THREE.WebGLRenderer( { antialias: true } );
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.gammaOutput = true;
				this.container.appendChild( this.renderer.domElement );
				window.addEventListener( 'resize', this.onWindowResize, false );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
				this.camera.position.set( -0.2, -13, 0 );
        this.scene.add( this.camera );
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
