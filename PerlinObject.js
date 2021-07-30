class PerlinObject extends GameObject {
    constructor() {
        super();
    }

    perlin = null;

    Start() {
        super();
        this.generatePerlin();
    }

    Update() {
        super();
        //render the perlin
    }

    generatePerlin = () => {
        //do something
    }
}