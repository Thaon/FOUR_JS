Math.seedrandom('yo!')
console.log(Math.random())

let camera = Game.createCamera(75);
camera.position.set(0,0,600);
camera.lookAt(new THREE.Vector3(0,0,0));
Game.setActiveCamera(camera);

Game.createControls(
    new THREE.OrbitControls( camera, Game.renderer.domElement )
);

let scene = Game.createScene("Level1");
Game.loadScene("Level1");

// const lightArr = [
//     {type:"point",x:0,y:1000,z:0,dx:500,},
//     {type:"point",x:0,y:1000,z:0},
//     {type:"point",x:0,y:1000,z:0},
//     {type:"point",x:0,y:1000,z:0},
// ];
// lightArr.forEach((n,i)=>{
//     let {x,y,z,dx,dy,dz} = n;
//     x = x ?? dx * i;
//     y = y ?? dy * i;
//     z = z ?? dz * i;
//     let light = Game.instantiate(
//         `point light ${i}`,
//         new THREE.Vector3(x,y,z),
//         new THREE.Vector3(0,0,0)
//     );
//     light.setLight("point", 0xFFFFFF, 1, 5000);
// })
let light = Game.instantiate("point light", new THREE.Vector3(1000, 1000, 0), new THREE.Vector3(0,0,0));
light.setLight("point", 0xFFFFFF, 1, 5000);
// let light3 = Game.instantiate("point light", new THREE.Vector3(-100, 100, 0), new THREE.Vector3(0,0,0));
// light3.setLight("point", 0xFFFFFF, 1, 5000);

let town = Game.instantiate("town", new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
town.loadGLTF(
    'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf'
);
town.loadTexture(
    'https://threejsfundamentals.org/threejs/resources/images/checker.png',
    THREE.RepeatWrapping,
    THREE.NearestFilter,
    1,
    1
);
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
