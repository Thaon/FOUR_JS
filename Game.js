let camera = Game.createCamera(75);
Game.setActiveCamera(camera)

let scene = Game.createScene("Level1");
Game.loadScene("Level1");

let light = Game.instantiate("point light", new THREE.Vector3(0, 10, 0), new THREE.Vector3());
light.setLight("point", 0xFFFFFF, 1, 5000);

let town = Game.instantiate("town", new THREE.Vector3(), new THREE.Vector3());
town.loadGLTF('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf');
town.loadTexture('https://threejsfundamentals.org/threejs/resources/images/checker.png', THREE.RepeatWrapping, THREE.NearestFilter, 1, 1);
town.setMaterial(true);