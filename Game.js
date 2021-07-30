Math.seedrandom('yo!')
console.log(Math.random())

//cache resources
Game.loadGLTF(
    'town',
    'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf'
);
Game.loadTexture(
    'tex',
    'https://threejsfundamentals.org/threejs/resources/images/checker.png',
    THREE.RepeatWrapping,
    THREE.NearestFilter,
    1,
    1
);

//setup camera
let camera = Game.createCamera(75);
camera.position.set(0,0,600);
camera.lookAt(new THREE.Vector3(0,0,0));
Game.setActiveCamera(camera);
Game.createControls(
    new THREE.OrbitControls( camera, Game.renderer.domElement )
);

//create scene
let scene = Game.createScene("Level1");
Game.loadScene("Level1");

//lights
let light = Game.instantiate("point light", new THREE.Vector3(1000, 1000, 0), new THREE.Vector3(0,0,0));
light.setLight("point", 0xFFFFFF, 1, 5000);

let town = Game.instantiate("town", new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));

town.setMesh("town")
town.setTexture('tex')

let ocean = Game.instantiate("ocean", new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
ocean.setMesh(
    new THREE.PlaneGeometry( 100, 100, 100 )
);
ocean.setMaterial(new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ))

// town.setMaterial(true);
const houseTypes = {
    church: {
        tileset: "path/to/church/tileset.png",
        tilemap: "path/to/church/tilemap.png",
        displacementmap: "path/to/church/displacementmap.png",
        tileWidth: 4,
        tileHeight: 4,
        colors: {
            "transparent": 0,
            "rgb(0,0,0)": 1,
            "rgb(255,255,255)": 2,
        }
    },
    jail: {
        tileset: "path/to/jail/tileset.png",
        tileWidth: 4,
        tileHeight: 4
    }
};
