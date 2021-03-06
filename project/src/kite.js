var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example',{ preload: preload, create: create, update: update}) ;

function preload() {

    // game.load.image('bigClouds', 'assets/images/bigClouds.jpg');

    //testing out new bg

        game.load.image('bigClouds', 'assets/images/bg3.jpg');
        game.load.spritesheet('string', 'assets/images/testString2.png', 4, 26);
        //game.load.spritesheet('chain', 'assets/images/chain.png', 16, 26);
        game.load.spritesheet('kite', 'assets/images/kite2.png', 135, 135);
        game.load.spritesheet('powerUp','assets/images/powerup.png',76,76);

}

// Initializes all variables
var kite;
var lives;
var boost;
var directional;
var powerUp;
var altitude;
var altitudeString;
var altitudeText;
//var currentHeight;
//var lastHeight=135;

var lastX;


var floatLinks = []; // The number of pieces in the string
var lastRect;
var wind = 0;
var windUp = -10;
var windUpVariance = 0;

function create() {

    // Setting up the game
    game.add.tileSprite(0, 0, 1500, 1500, 'bigClouds');
    game.world.setBounds(0, 0, 1500, 1500);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.p2.gravity.y = 0;

    // Creating the kite
    kite = game.add.sprite(135,135, 'kite');
    kite.anchor.setTo(0,0);
    game.physics.enable(kite, Phaser.Physics.P2JS);
    // kite.body.collideWorldBounds = true;
    // kite.body.bounce.setTo(0.5, 0.5);

    // Creating the powerup
    powerUp=game.add.sprite(400 ,160,'powerUp');
    powerUp.anchor.setTo(1,1);
    game.physics.enable(powerUp, Phaser.Physics.P2JS);

    //Adds tail
    //createRope(5,kite.x,kite.y+20);

    // Creating lives text
    lives = game.add.group();
    game.add.text(game.world.width - 200, 10, 'Lives : ', { font: '25px Arial', fill: '#fff' });

    //displaying the altitude of kite
    altitudeString= 'Current Altitude : ';
    altitude = kite.y;
    game.add.text(20,10, altitudeString + altitude, { font: '25px Arial', fill: '#fff' });


    // Setting up controls
    directional= game.input.keyboard.createCursorKeys();
    boost = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.addMoveCallback(move, this);
    game.input.onDown.add(onDown, this);
    game.input.onUp.add(onUp, this);

    // Sets up camera to follow the kite
    // game.camera.follow(kite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

}

function onDown() {
    lastX = game.input.activePointer.x;
}

function onUp() {
    deltaX = game.input.activePointer.x - lastX;
    kite.body.velocity.x += deltaX*.9;
}

function move(pointer, x, y, click) {
    kite.body.velocity.x += 1002*game.input.activePointer.movementX;    
}


// function move(pointer, x, y, click) {
//     kite.body.velocity.x += 5*game.input.mouse.event.movementX;
// }


// Locks your cursor into the kite so you can control it
function lock() {
    if(game.input.mouse.locked) {
        game.input.mouse.releasePointerLock();
        game.input.mouse.locked = false;
    } else {
        game.input.mouse.requestPointerLock();
    }
}

function update() {
    game.debug.pointer(game.input.activePointer);

    // tailReset();
    // kite.angle = 70    kite.angle = 7;;


    //altitude = altitude + (currentHeight - lastHeight);
    altitudeUpdate();
    
    CameraPan();
    




    windUpVariance = Math.random()*10;
    if (windUpVariance <= 2) {
        windUp -= 3;
    } else if (windUpVariance >= 8) {
        windUp += 3;
    } else {

    }

    // if (windUp <= -400) {
    //     windUp = -200;
    // } else if (windUp >= 250) {
    //     windUp = -50;
    // }

    if (wind >= 50) {
        wind = 10;
    } else if(wind <= -50) {
        wind = -10;
    }

    wind += Math.random()*10 - Math.random()*10;
    // windUpVariance += Math.random()*10 - 5 - windUp / 1000 ;
    // windUp += windUpVariance;
    //console.log(windUp);


    for (var i = 0; i < floatLinks.length; i++) {
        floatLinks[i].body.velocity.y = windUp;
        floatLinks[i].body.velocity.x += wind;
    }

    kite.body.velocity.y += 150/60;

    if (directional.left.isDown){
      kite.body.velocity.x = -150;
    }
    else if (directional.right.isDown){
      kite.body.velocity.x = 150;
    }
    else if (directional.up.isDown){
      kite.body.velocity.y = -150;
    }
    else if (directional.down.isDown){
      kite.body.velocity.y = 150;
    }


    // kite.body.velocity.x += wind;

    // if(kite.body.velocity.x<0)
    // {
    //     kite.angle = 135;

    // }else if(kite.body.velocity.x>0){

    //     kite.angle = 45;
    // }

    if(boost.isDown)
    {
        Boost();
    }

    // yWindUpdate();
    // xWindUpdate();
    // yAcclCap();
    // xAcclCap();

    // game.physics.P2JS.overlap(kite, powerUp, collisionHandler, false, this);



}


function createRope(length, xAnchor,yAnchor) {
    var height = 16;        //  Height for the physics body - your image height is 8px
    var width = 30;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 30000;    // The force that holds the rectangles together.

    for (var i = 0; i <= length; i++) {
        var x = xAnchor;                    //  All rects are on the same x position
        var y = (yAnchor) - (i * height);     //  Every new rect is positioned below the last

        //Add string sprite
        newRect = game.add.sprite(x,y,'string');

        //  Enable physicsbody
        game.physics.p2.enable(newRect, false);

        //  Set custom rectangle
        newRect.body.setRectangle(width, height);

        if (i === 0) {
            //  Anchor the first one created
            newRect.body.static = false;
            game.physics.p2.createRevoluteConstraint(kite, [0,+70], newRect, [0,10],maxForce);
        } else {
           newRect.body.mass = length / i;     //  Reduce mass for evey rope element
        }

        //  After the first rectangle is created we can add the constraint
        if (lastRect) {
            game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce);
        }
        if (length - i < 3) {
            floatLinks.push(lastRect);
        }

        if (length - i > 8) {
            newRect.visible = false;
        }

        lastRect = newRect;

    }

}

function Boost(){
    kite.body.velocity.y+= -10;
}



function yAcclCap(){
    if(kite.body.velocity.y>400){
        kite.body.velocity.y=400;
    }
    else if (kite.body.velocity.y<-600){
        kite.body.velocity.y=-600;
    }
}


function xAcclCap(){
    if(kite.body.velocity.x>300){
        kite.body.velocity.x=300;
    }
    else if (kite.body.velocity.x<-300){
        kite.body.velocity.x=-300;
    }
}


function collisionHandler(kite, powerUp){
    powerUp.kill();
    kite.body.velocity.y=-350;
}

function yWindUpdate(){
    kite.body.velocity.y+=wind;
}

function xWindUpdate(){
    kite.body.velocity.x+=wind;
}

function altitudeUpdate(){
    altitude = kite.y;
}



function CameraPan(){

 game.camera.y+=-2;
}


function lose() {
  if(kite.body.position.y == game.world.height - 50)
    game.add.text(game.world.width - 200, 10, 'Game Over', { font: '25px Arial', fill: '#fff' });
}
