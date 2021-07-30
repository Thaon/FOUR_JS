class Engine {
    constructor(){
        
        //setup the renderer
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.setClearColor("#e5e5e5");

        document.body.appendChild(this.renderer.domElement);

        //setup listeners
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        
            this.mainCamera.updateProjectionMatrix();
        })

        window.addEventListener('mousemove', this.onMouseMove);
    }

    //rendering
    renderer = new THREE.WebGLRenderer({antialias: true});
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
        let camera = new THREE.PerspectiveCamera(fov,window.innerWidth/window.innerHeight,0.1,1000);
        this.cameras.push(camera);
        return camera;
    }

    setActiveCamera = (camera) => {
        this.mainCamera = camera;
    }

    Run() {
            if (this.activeScene == null)
                return;
            //process GameObjects in scene
            this.activeScene.objects.forEach(go => {
                go.Update();
            });
    
            //process physics (TODO)
    
            //render scene
            requestAnimationFrame(render);
            renderer.render(this.activeScene, this.mainCamera);
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
        if (scene != null)
        {
            this.activeScene = scene;
        }
        else
        {
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
        go.position.set(position);
        go.rotation.set(rotation);
        this.activeScene.objects.push(this);
        return go;
    }

    destroy = (go) => {
        let inScene = this.activeScene.objects.find(X => X == go);
        if (inScene != null)
        {
            inScene = this.activeScene.objects.filter(X => X == go);
            go = null;
        }
    }

    //input management
    mousePosition = new THREE.Vector2();

    onMouseMove = (event) => {
        event.preventDefault();
    
        this.mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
        // raycaster.setFromCamera(this.mousePosition, this.mainCamera);
    
        // var intersects = raycaster.intersectObjects(scene.children, true);
        // for (var i = 0; i < intersects.length; i++) {
        // }
    }
}

class GameObject extends THREE.Object3D{
    constructor() {
        super();
    }

    name = "";
    mesh = null;
    texture = null;
    material = null;
    light = null;

    /*
    / Will Be called by the game engine when a scene is loaded
    */
    Start = () => {

    }

    /*
    / Will Be called by the game engine every "tick"
    */
    Update = () => {
        //update light position if there is one
        if (this.light != null)
        {
            light.position.set(position.x, position.y, position.z);
        }
    }

    setposition = (position) => {
        this.position.set(position);
    }

    setRotation = (rotationVector) => {
        this.rotation.set(rotationVector);
        let quaternion = quaternion = new THREE.Quaternion();
        this.quaternion.set(quaternion.setFromEuler(rotationVector));
    }

    /*
    / test with 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf'
    */
    loadGLTF = (path) => {
        let gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(path, (gltf) => {
            let root = gltf.scene;
            this.mesh = root;
            Game.activeScene.add(root);
        });
    }

    /*
    / test with 'https://threejsfundamentals.org/threejs/resources/images/checker.png'
    / THREE.RepeatWrapping
    / THREE.NearestFilter
    */
    loadTexture = (path, wrappingMode, filterMode, repeatsX, repeatsY) => {
        let loader = new THREE.TextureLoader();
        this.texture = loader.load(path);
        this.texture.wrapS = wrappingMode;
        this.texture.wrapT = wrappingMode;
        this.texture.magFilter = filterMode;
        this.texture.repeat.set(repeatsX, repeatsY);
    }

    setMaterial = (doubleSided) => {
        this.material = new THREE.MeshPhongMaterial({
            map: this.texture,
            side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
          });
    }

    setLight = (type, color, intensity, radius) => {
        switch (type){
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

        this.light.position.set(
            this.position.x, 
            this.position.y, 
            this.position.z);
        Game.activeScene.add(light);
    }
}

var Game = new Engine();
Game.Run();