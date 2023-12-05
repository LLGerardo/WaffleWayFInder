function returnback(){
    window.location.href="../game/wafflestackPage.html";
}

"use strict";
console.clear();

class Stage {
    constructor() {
        // container
        this.render = function () {
            this.renderer.render(this.scene, this.camera);
        };
        this.add = function (elem) {
            this.scene.add(elem);
        };
        this.remove = function (elem) {
            this.scene.remove(elem);
        };
        this.container = document.getElementById('game');
        this.container.style.marginLeft = '400px';
        this.container.style.marginTop = '110px';

       
        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(600, 600);
        this.renderer.setClearColor('#066294', 1); //Use this as the background bc of the contrast
        this.container.appendChild(this.renderer.domElement);
        // scene
        this.scene = new THREE.Scene();
        // camera
        let aspect = window.innerWidth/2 / window.innerHeight/2;
        let d = 20;
        this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);

        this.camera.position.x = 2;
        this.camera.position.y = 2;
        this.camera.position.z = 2;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        //light
        this.light = new THREE.DirectionalLight(0xffffff, 0.5);
        this.light.position.set(0, 499, 0);
        this.scene.add(this.light);
        this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.softLight);
        window.addEventListener('resize', () => this.onResize());
        this.onResize();
    }
    setCamera(y, speed = .05) {//5.0
        TweenLite.to(this.camera.position, speed, { y: y + .1, ease: Power1.easeInOut }); //4
        TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
    }
    onResize() { //This is what I changed to make the window of the game more smaller - divided the height and width
        let viewSize = 32; //Changes how close the stack is to the persepective of the front
        this.renderer.setSize(600, 600); //change the size of the grey window of the block game HERE!

        //this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        this.camera.left = window.innerWidth/2 / -viewSize;
        this.camera.right = window.innerWidth/2 / viewSize;
        this.camera.top = window.innerHeight/3 / viewSize; //top perspective angle
        this.camera.bottom = window.innerHeight/1 / -viewSize; //where the black block starts off at
        this.camera.updateProjectionMatrix();
    }
}
class Block {
    constructor(block) {
        // set size and position
        this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
        this.MOVE_AMOUNT = 15; //How many blocks/lenght the block  moves from side to side
        this.dimension = { width: 0, height: 0, depth: 0 };
        this.position = { x: 0, y: 0, z: 0 };
        this.targetBlock = block;
        this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
        this.workingPlane = this.index % 2 ? 'x' : 'z';
        this.workingDimension = this.index % 2 ? 'width' : 'depth';
        // set the dimensions from the target block, or defaults.
        this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
        this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
        this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
        this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
        this.position.y = this.dimension.height * this.index;
        this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
        this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);

// Define an array of predefined colors
    const predefinedColors = [
        //0xa8133f, // strawberry jam
        0xe09f4a,// Yellow - waffle/honey
        0xFEAE34, // Brown - waffle
        0xf5efda,
        0xd47a0F
    ];
    // Set color
    if (!this.targetBlock) {
        this.color = 0x3C4142;
    } else {
        const offset = this.index + this.colorOffset;
        const colorIndex = offset % predefinedColors.length;
        this.color = new THREE.Color(predefinedColors[colorIndex]);
    }

        // state
        this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;
        // set direction
        this.speed = -0.025 - (this.index * 0.03); //This is the part that edits the speed at which the blocks fly in
        if (this.speed < -7)
            this.speed = -4;
        this.direction = this.speed;
        // create block
        let geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
        this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y + (this.state == this.STATES.ACTIVE ? 0 : 0), this.position.z);
        if (this.state == this.STATES.ACTIVE) {
            this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
        }
    }
   
    reverseDirection() {
        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
    }
    place() {
        this.state = this.STATES.STOPPED;
        let overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);
        let blocksToReturn = {
            plane: this.workingPlane,
            direction: this.direction
        };
        if (this.dimension[this.workingDimension] - overlap < 0.3) {
            overlap = this.dimension[this.workingDimension];
            blocksToReturn.bonus = true;
            this.position.x = this.targetBlock.position.x;
            this.position.z = this.targetBlock.position.z;
            this.dimension.width = this.targetBlock.dimension.width;
            this.dimension.depth = this.targetBlock.dimension.depth;
        }
        if (overlap > 0) {
            let choppedDimensions = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
            choppedDimensions[this.workingDimension] -= overlap;
            this.dimension[this.workingDimension] = overlap;
            let placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
            placedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
            let placedMesh = new THREE.Mesh(placedGeometry, this.material);
            let choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
            choppedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(choppedDimensions.width / 2, choppedDimensions.height / 2, choppedDimensions.depth / 2));
            let choppedMesh = new THREE.Mesh(choppedGeometry, this.material);
            let choppedPosition = {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            };
            if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
                this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
            }
            else {
                choppedPosition[this.workingPlane] += overlap;
            }
            placedMesh.position.set(this.position.x, this.position.y, this.position.z);
            choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);
            blocksToReturn.placed = placedMesh;
            if (!blocksToReturn.bonus)
                blocksToReturn.chopped = choppedMesh;
        }
        else {
            this.state = this.STATES.MISSED;
        }
        this.dimension[this.workingDimension] = overlap;
        return blocksToReturn;
    }
    tick() {
        if (this.state == this.STATES.ACTIVE) {
            let value = this.position[this.workingPlane];
            if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT)
                this.reverseDirection();
            this.position[this.workingPlane] += this.direction;
            this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
        }
    }
}
class Game {
    constructor() {
        this.STATES = {
            'PLAYING': 'playing',
            'READY': 'ready',
            'ENDED': 'ended',
        };
        this.blocks = [];
        this.state = this.STATES.LOADING;
        this.stage = new Stage();
        this.mainContainer = document.getElementById('container');
        this.scoreContainer = document.getElementById('score');
        this.startButton = document.getElementById('start-button');
        this.instructions = document.getElementById('instructions');
        this.scoreContainer.innerHTML = '0';
        this.newBlocks = new THREE.Group();
        this.placedBlocks = new THREE.Group();
        this.choppedBlocks = new THREE.Group();
        this.stage.add(this.newBlocks);
        this.stage.add(this.placedBlocks);
        this.stage.add(this.choppedBlocks);
        this.addBlock();
        this.tick();
        this.updateState(this.STATES.READY);
       
       
    // Add a click event listener to the button
    this.startButton.addEventListener('click', () => this.onStartRestartButtonClick());
       
    this.startButton.addEventListener('start-button', () => this.onStartRestartButtonClick());//dosen't work rn



        //if click on page
        document.addEventListener('click', e => {
            // Handle the click event or trigger the game actions here
           
            if (game.state === game.STATES.READY) {
                game.startGame();
                this.scoreContainer.style.visibility = 'visible'; // Make the score visible
            } else if (game.state === game.STATES.PLAYING) {
                game.placeBlock();
            }
        });
        //if click on start button //Couldn't get this to work but I wanted to leave it to show that I tried to implement this
        document.addEventListener('start-button', e => {
    // Handle the touch event or trigger the game actions here
    if (game.state === game.STATES.READY) {
        game.startGame();
        this.scoreContainer.style.visibility = 'visible'; // Make the score visible
    } else if (game.state === game.STATES.PLAYING) {
        game.placeBlock();
    }
        });
       
    }
   
     
    updateState(newState) {
        for (let key in this.STATES)
            this.mainContainer.classList.remove(this.STATES[key]);
        this.mainContainer.classList.add(newState);
        this.state = newState;
    }
   
    startGame() {
        if (this.state != this.STATES.PLAYING) {
            this.scoreContainer.style.visibility = 'visible'; // Make the score visible
            this.scoreContainer.innerHTML = '1';
            this.updateState(this.STATES.PLAYING);
            this.addBlock();
        }
    }
   
    placeBlock() {
        let currentBlock = this.blocks[this.blocks.length - 1];
        let newBlocks = currentBlock.place();
        this.newBlocks.remove(currentBlock.mesh);
        if (newBlocks.placed)
            this.placedBlocks.add(newBlocks.placed);
        if (newBlocks.chopped) {
            this.choppedBlocks.add(newBlocks.chopped);
            let positionParams = { y: '-=30', ease: Power1.easeIn, onComplete: () => this.choppedBlocks.remove(newBlocks.chopped) };
            let rotateRandomness = 10;
            let rotationParams = {
                delay: 0.05,
                x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                y: Math.random() * 0.1,
            };
            if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
                positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
            }
            else {
                positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
            }
            TweenLite.to(newBlocks.chopped.position, 1, positionParams);
            TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
        }
        this.addBlock();
    }
    addBlock() {
        let lastBlock = this.blocks[this.blocks.length - 1];
        if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
            return this.endGame();
        }
        this.scoreContainer.innerHTML = String(this.blocks.length - 1);
        let newestBlockAdded = new Block(lastBlock);
        this.newBlocks.add(newestBlockAdded.mesh);
        this.blocks.push(newestBlockAdded);
        this.stage.setCamera(this.blocks.length * 2);
       
    }
    endGame() {
        this.updateState(this.STATES.ENDED);

    }
    tick() {
        this.blocks[this.blocks.length - 1].tick();
        this.stage.render();
        requestAnimationFrame(() => { this.tick(); });
    }
}
let game = new Game();