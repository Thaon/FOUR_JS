class Engine {
    constructor() {
        console.log(this.renderer);
        //setup the renderer
        this.renderer.setSize(64, 64);
        this.setClearColor("#e5e5e5");

        document.body.appendChild(this.renderer.domElement);

        //setup listeners
        window.addEventListener('resize', () => {
            this.renderer.setSize(64, 64);
            this.mainCamera.aspect = 64 / 64;

            this.mainCamera.updateProjectionMatrix();
        })

        window.addEventListener('mousemove', this.onMouseMove);
    }

    //utils
    debugMode = true;

    //resources
    meshes = [];
    textures = [];
    materials = [];

    /*
    / test with 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf'
    */
    loadGLTF = (name, path) => {
        let gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(path, (gltf) => {
            let root = gltf.scene;
            root.position.set(0, 0, 0);
            let mesh = root;

            if (this.debugMode) console.log(dumpObject(root).join('\n'));

            this.meshes.push(name, mesh);
        });
    }

    /*
    / test with 'https://threejsfundamentals.org/threejs/resources/images/checker.png'
    / THREE.RepeatWrapping
    / THREE.NearestFilter
    */
    loadTexture = (name, path, wrappingMode, filterMode, repeatsX, repeatsY) => {
        let loader = new THREE.TextureLoader();
        loader.load(path, texture =>{
            this.texture = texture;
            this.texture.wrapS = wrappingMode;
            this.texture.wrapT = wrappingMode;
            this.texture.magFilter = filterMode;
            this.texture.repeat.set(repeatsX, repeatsY);
        });
        this.textures.push({name, texture:loader.texture});
    }

    createMaterial = (name, texture, doubleSided) => {
        let material = new THREE.MeshPhongMaterial({
            map: texture,
            side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
        });
        this.materials.push({name, material})
    }

    //rendering
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    mainCamera = null;
    cameras = [];

    //global rendering settings
    setAntiAlias = (value) => {
        this.renderer.antialias = value;
    }

    setClearColor = (color) => {
        this.renderer.setClearColor(color);
    }

    //camera management
    createCamera = (fov) => {
        let camera = new THREE.PerspectiveCamera(fov, 64 / 64, 0.1, 10000);
        this.cameras.push(camera);
        return camera;
    }

    //camera management
    createControls = (controls) => {
        this.controls = controls;
    }

    setActiveCamera = (camera) => {
        this.mainCamera = camera;
    }

    Run() {
        if (this.activeScene == null) {
            setTimeout(() => {
                Game.Run.bind(this)();
            }, 100);
            return;
        }
        //process GameObjects in scene
        this.activeScene.objects.forEach(go => {
            go.Update();
        });

        if(this.controls) {
            this.controls.update();
        }

        //process physics (TODO)
        // console.log('this === ',this);

        //render scene
        requestAnimationFrame(() => {
            Game.Run.bind(this)();
        });
        this.renderer.render(this.activeScene, this.mainCamera);
    }

    //scene management
    activeScene = null;
    scenes = []

    createScene = (name) => {
        let scene = new THREE.Scene();
        scene.name = name;
        scene.objects = [];
        this.scenes.push(scene);
        return scene;
    }

    findScene = (name) => {
        return this.scenes.find(X => X.name == name);
    }

    loadScene = (name) => {
        let scene = this.findScene(name)
        if (scene != null) {
            this.activeScene = scene;
        } else {
            console.log("COULD NOT FIND THE REQUESTED SCENE!");
            return;
        }

        //call start on all GameObjects
        this.activeScene.objects.forEach(go => {
            go.Start();
        });
    }

    //GameObjects management
    instantiate = (name, position, rotation) => {
        let go = new GameObject();
        go.name = name;
        console.log('position === ',position);
        console.log('go.position === ',go.position);
        if(go.mesh !== null) {
            go.position.copy(position);
            go.rotation.copy(rotation);
        }
        this.activeScene.objects.push(go);
        return go;
    }

    destroy = (go) => {
        let inScene = this.activeScene.objects.find(X => X == go);
        if (inScene != null) {
            inScene = this.activeScene.objects.filter(X => X == go);
            go = null;
        }
    }

    //input management
    mousePosition = new THREE.Vector2();

    onMouseMove = (event) => {
        event.preventDefault();

        this.mousePosition.x = (event.clientX / 64) * 2 - 1;
        this.mousePosition.y = -(event.clientY / 64) * 2 + 1;

        // raycaster.setFromCamera(this.mousePosition, this.mainCamera);

        // var intersects = raycaster.intersectObjects(scene.children, true);
        // for (var i = 0; i < intersects.length; i++) {
        // }
    }
}

class GameObject extends THREE.Object3D {
    constructor() {
        super();
    }

    name = "";
    mesh = null;
    texture = null;
    material = null;
    lights = [];

    /*
    / Will Be called by the game engine when a scene is loaded
    */
    Start = () => {

    }

    /*
    / Will Be called by the game engine every "tick"
    */
    Update = () => {
        if (this.mesh === null) return;
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
        // console.log('this.mesh.position === ',this.mesh.position);
    }

    setPosition = (position) => {
        this.position.set(position);
    }

    setRotation = (rotationVector) => {
        this.rotation.set(rotationVector);
        let quaternion = quaternion = new THREE.Quaternion();
        this.quaternion.set(quaternion.setFromEuler(rotationVector));
    }

    //visual elements
    setMesh = (meshName) => {
        let data = Game.meshes.find(X => X.name == meshName);
        if (data != null)
            this.mesh = data.mesh;
    }

    setCustomMesh = (mesh) => {
        this.mesh = mesh;
    }

    setTexture = (textureName) => {
        let data = Game.textures.find(X => X.name == textureName);
        if (data != null)
            this.texture = data.texture;
    }

    setMaterial = (materialName) => {
        if(!this.mesh || !this.texture) return;
        let data = Game.materials.find(X => X.name == materialName);
        if (data != null)
        {
            this.texture = data.material;
            this.mesh.material.needsUpdate = true;
        }
    }

    setMaterial = (material) => {
        this.material = material;
    }

    setLight = (type, color, intensity, radius) => {
        switch (type) {
            case "point":
                this.light = new THREE.PointLight(color, intensity, radius);
                break;

            case "directional":
                this.light = new THREE.DirectionalLight(color, intensity);
                break;

            case "hemisphere":
                this.light = new THREE.HemisphereLight(color, color, intensity); //TODO: fix this to be a more generalized method, probably use polymorphism
                break;
        }
        Game.activeScene.add(this.light);
    }
}

var Game = new Engine();
Game.Run();

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}