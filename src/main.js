
var game = new Phaser.Game(900, 800, Phaser.AUTO);

var map, mapLayer;

var score = 0;
var text;
var textGroup;
var livesText;
var dieButton;
var changeButton;
var tempDir;
var counter = 0;
var counter2 = 0;
var counter3 = 0;
var counter4 = 0;
var powerCounter = 0;
var poweredUp = false;
var home = new Phaser.Point(15,17)


var PlayerState = { MALE: false, FEMALE: true };
var playerGender = PlayerState.MALE;


//CHASER VARS
var chaser;
var chaserdirections = [null, null, null, null, null];
var chaserComingFrom = Utilities.Left;
var chasermarker = new Phaser.Point();
var chaserReturn = false;

//RACER VARS
var racer;
var racerdirections = [null, null, null, null, null];
var racerComingFrom = Utilities.Right;
var racermarker = new Phaser.Point();
var racerReturn = false;

//TRACER VARS
var tracer;
var tracerdirections = [null, null, null, null, null];
var tracerComingFrom = Utilities.Left;
var tracermarker = new Phaser.Point();
var tracerReturn = false;

//CARIBOU
var caribou;
var cariboudirections = [null, null, null, null, null];
var caribouComingFrom = Utilities.Right;
var cariboumarker = new Phaser.Point();
var caribouReturn = false;

var decisionPoints = [new Phaser.Point(8, 1), new Phaser.Point(11, 1), new Phaser.Point(20, 1), new Phaser.Point(23, 1),
    new Phaser.Point(2, 4), new Phaser.Point(29, 4),
    new Phaser.Point(8, 7), new Phaser.Point(11, 7), new Phaser.Point(14, 7), new Phaser.Point(17, 7), new Phaser.Point(20, 7), new Phaser.Point(23, 7),
    new Phaser.Point(8, 10), new Phaser.Point(23, 10),
    new Phaser.Point(14, 13), new Phaser.Point(17, 13),
    new Phaser.Point(11, 19), new Phaser.Point(20, 19),
    new Phaser.Point(8, 22), new Phaser.Point(11, 22), new Phaser.Point(20, 22), new Phaser.Point(23, 22),
    new Phaser.Point(2, 25), new Phaser.Point(8, 25), new Phaser.Point(11, 25), new Phaser.Point(14, 25), new Phaser.Point(17, 25), new Phaser.Point(20, 25), new Phaser.Point(23, 25), new Phaser.Point(29, 25),
    new Phaser.Point(2, 28), new Phaser.Point(7, 28), new Phaser.Point(11, 28), new Phaser.Point(14, 28), new Phaser.Point(17, 28), new Phaser.Point(20, 28), new Phaser.Point(25, 28), new Phaser.Point(29, 28),
	new Phaser.Point(7, 32), new Phaser.Point(11, 32), new Phaser.Point(14, 32), new Phaser.Point(17, 32), new Phaser.Point(20, 32), new Phaser.Point(25, 32) ];

var Pacman = function (game) {

    this.map = null;
    this.pacman = null;
    this.comingFrom = Utilities.Right;


    this.safetile = 3;
    this.gridsize = 24;

    this.speed = 175;
    this.threshold = 6;
    this.AIthreshold = 2;
    this.lives = 3;

	this.justTeleported = false;
	
    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [null, null, null, null, null];
    this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;

};


Pacman.prototype = {

    init: function () {
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.physics.startSystem(Phaser.Physics.ARCADE);


    },



    preload: function () {

        text = game.add.text(0, 0, score, { font: "24px Arial", fill: "#ff0044", align: "center" });
        livesText = game.add.text(game.world.width - 100, 0, this.lives, { font: "24px Arial", fill: "#ff0044", align: "center" });

        this.load.image('dot', 'assets/dot.png');

        this.load.tilemap('map', 'assets/pac_maze.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tile_set.png');
        this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
        this.load.image('ghost', 'assets/ghost.png');
        game.load.image('pinky', 'assets/pinky.png');
        game.load.spritesheet('exitLights', 'assets/exitLights.png', 24, 24);
        game.load.spritesheet('playerm', 'assets/playerm.png', 40, 40);
        game.load.spritesheet('playerf', 'assets/playerf.png', 40, 40);
        game.load.image('chaser', 'assets/chaser.png');
    },



    create: function () {

        this.stage.backgroundColor = '#787878';
        map = game.add.tilemap('map');
        map.addTilesetImage('pacman', 'tiles');
        mapLayer = map.createLayer('Tile Layer 1');
        mapLayer.resizeWorld();

        this.dots = this.add.physicsGroup();
        map.createFromTiles(3, this.safetile, 'dot', mapLayer, this.dots);

        //  The dots will need to be offset by 12px to put them back in the middle of the grid
        this.dots.setAll('x', 12, false, false, 1);
        this.dots.setAll('y', 12, false, false, 1);

        this.stairs = this.add.physicsGroup();
        map.createFromTiles(6, 6, 'dot', mapLayer, this.stairs);

        this.spray = this.add.physicsGroup();
        map.createFromTiles(4, 4, 'dot', mapLayer, this.spray);

        map.setCollisionByExclusion([this.safetile, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15], true, mapLayer);

        this.pacman = this.add.sprite((3 * 24) + 12, (1 * 24) + 12, 'playerm', 0);
        this.pacman.anchor.set(0.5);
        this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);
        this.pacman.animations.add('walkDown', [0, 1, 2, 3], 12, true);
        this.pacman.animations.add('walkRight', [8, 9, 10, 11], 12, true);
        this.pacman.animations.add('walkUp', [4, 5, 6, 7], 12, true);

        this.physics.arcade.enable(this.pacman);
        this.pacman.body.setSize(24, 24, 0, 0);
        this.cursors = this.input.keyboard.createCursorKeys();


        // dieButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // dieButton.onDown.add(this.die, this);
        changeButton = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        changeButton.onDown.add(this.changePlayer, this);

        this.pacman.play('walkRight');
        this.move(Phaser.RIGHT);



        // GUARD 1
        chaser = this.add.sprite((this.gridsize * 2) + 12, (this.gridsize * 10) + 12, 'pinky', 0);
        chaser.anchor.set(0.5);
        this.game.physics.enable(chaser, Phaser.Physics.ARCADE);
        chaser.body.setSize(24, 24, 0, 0);
        chaser.body.velocity.x = Utilities.Speed;

        // GUARD 2
        racer = this.add.sprite((this.gridsize * 29) + 12, (this.gridsize * 4) + 12, 'chaser', 0);
        racer.anchor.set(0.5);
        this.game.physics.enable(racer, Phaser.Physics.ARCADE);
        racer.body.setSize(24, 24, 0, 0);
        racer.body.velocity.x = -Utilities.Speed;

        // GUARD 3
        tracer = this.add.sprite((this.gridsize * 2) + 12, (this.gridsize * 28) + 12, 'chaser', 0);
        tracer.anchor.set(0.5);
        this.game.physics.enable(tracer, Phaser.Physics.ARCADE);
        tracer.body.setSize(24, 24, 0, 0);
        tracer.body.velocity.x = Utilities.Speed;

        // GUARD 4
        caribou = this.add.sprite((this.gridsize * 29) + 12, (this.gridsize * 28) + 12, 'chaser', 0);
        caribou.anchor.set(0.5);
        this.game.physics.enable(caribou, Phaser.Physics.ARCADE);
        caribou.body.setSize(24, 24, 0, 0);
        caribou.body.velocity.x = -Utilities.Speed;

        textGroup = game.add.group();
        textGroup.add(text);



        StartExit();

    },

    checkKeys: function () {

        if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
            this.checkDirection(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
            this.checkDirection(Phaser.RIGHT);
        }
        else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
            this.checkDirection(Phaser.UP);
        }
        else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
            this.checkDirection(Phaser.DOWN);
        }
        else {
            //  This forces them to hold the key down to turn the corner
            this.turning = Phaser.NONE;
        }
    },

    checkDirection: function (turnTo) {

        // NOTE: The Index != safetile part is making it so that pacman can't turn when on white tiles.
        // Change this line to give more options for safe tiles, or might have to redo parts of tilemap.
        if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile) {
            if (!(this.directions[turnTo].index == 8 || this.directions[turnTo].index == 4 || this.directions[turnTo].index == 5)) {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                return;
            }

        }
        //  Check if they want to turn around and can
        if (this.current === this.opposites[turnTo]) {
            this.move(turnTo);
        }
        else {
            this.turning = turnTo;
            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }
    },

    turn: function () {
        var cx = Math.floor(this.pacman.x);
        var cy = Math.floor(this.pacman.y);
        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
            return false;
        }
        //  Grid align before turning
        this.pacman.x = this.turnPoint.x;
        this.pacman.y = this.turnPoint.y;
        this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);
        this.move(this.turning);
        this.turning = Phaser.NONE;
        return true;
    },

    move: function (direction) {
        var speed = this.speed;
        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed;
        }
        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.pacman.body.velocity.x = speed;
        }
        else {
            this.pacman.body.velocity.y = speed;
        }
        //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
        this.pacman.scale.x = 1;
        this.pacman.angle = 0;
        if (direction === Phaser.LEFT) {
            this.pacman.scale.x = -1;
            this.pacman.play('walkRight');
        }
        else if (direction === Phaser.UP) {
            // this.pacman.angle = 270;
            this.pacman.play('walkUp');
        }
        else if (direction === Phaser.DOWN) {
            // this.pacman.angle = 90;
            this.pacman.play('walkDown');
        }
        else if (direction === Phaser.RIGHT) {
            this.pacman.play('walkRight');
        }
        this.current = direction;
    },



    eatDot: function (pacman, dot) {
        dot.kill();
        if (this.dots.total === 0) {
            this.dots.callAll('revive');
        }
        score += 10;
        text.text = score;
    },

    die: function () {
        this.lives--;

        if (this.lives < 1) {
            game.state.start('GameOver');
            //game.add.text(game.world.centerX, game.world.centerY - 200, "Game Over", { font: "48px Arial", fill: "#ff0044", align: "center" });
            // textGroup.add.text(game.world.centerX, game.world.centerY - 200, "Game Over", { font: "48px Arial", fill: "#ffffff", align: "center" });
            //this.pacman.kill();
        }
        else {

            this.dots.callAll('revive');
            this.pacman.x = (3 * this.gridsize) + this.gridsize / 2;
            this.pacman.y = (1 * this.gridsize) + this.gridsize / 2;
            this.move(Phaser.RIGHT);
        }
        livesText.text = this.lives;
    },

    changePlayer: function () {
        if (playerGender == PlayerState.MALE) {
            this.pacman.loadTexture('playerf', 0);
            playerGender = PlayerState.FEMALE;
        }
        else {
            this.pacman.loadTexture('playerm', 0);
            playerGender = PlayerState.MALE;
        }
    },

    teleport: function () {
        if (!this.justTeleported) {
            if (this.pacman.x > game.world.centerX) {
                this.pacman.x = (1 * this.gridsize) + this.gridsize / 2;
                this.pacman.y = (16 * this.gridsize) + this.gridsize / 2;
                this.move(Phaser.RIGHT);
            }
            else {
                this.pacman.x = (29 * this.gridsize) + this.gridsize / 2;
                this.pacman.y = (16 * this.gridsize) + this.gridsize / 2;
                this.move(Phaser.LEFT);
            }
        }
    },

    //GUARD 1

    ghostAI: function () {

        chasermarker.x = this.math.snapToFloor(Math.floor(chaser.x), this.gridsize) / this.gridsize;
        chasermarker.y = this.math.snapToFloor(Math.floor(chaser.y), this.gridsize) / this.gridsize;

        chaserdirections[Utilities.Up] = map.getTileAbove(map.getLayer(), chasermarker.x, chasermarker.y);
        chaserdirections[Utilities.Left] = map.getTileLeft(map.getLayer(), chasermarker.x, chasermarker.y);
        chaserdirections[Utilities.Down] = map.getTileBelow(map.getLayer(), chasermarker.x, chasermarker.y);
        chaserdirections[Utilities.Right] = map.getTileRight(map.getLayer(), chasermarker.x, chasermarker.y);


        //STUCK IN A CORNER
        if (chaser.body.velocity.x === 0 && chaser.body.velocity.y === 0) {

            for (var i = Utilities.Up; i < 4;) {
                if (i !== chaserComingFrom) {
                    if (chaserdirections[i].index === this.safetile || chaserdirections[i].index === 8) {
                        this.chasermove(i);
                        break;
                    }

                }
                i++;
            }
        }

        for (var i = 0; i < decisionPoints.length;) {

            if (this.math.fuzzyEqual(chaser.body.x, Utilities.tileToPixels(decisionPoints[i].x), this.AIthreshold) && this.math.fuzzyEqual(chaser.body.y, Utilities.tileToPixels(decisionPoints[i].y), this.AIthreshold)) {

                if (chaserReturn === true) {

                    var xDiff = Utilities.tileToPixels(home.x) - chaser.body.x;
                    var yDiff = Utilities.tileToPixels(home.y) - chaser.body.y;

                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (chaserdirections[3].index === this.safetile || chaserdirections[3].index === 8) {
                                this.chaserSetAndMove(i, 3);
                                counter = 10;
                                var done = true;
                                
                            }
                        }
                        else {
                            if (chaserdirections[1].index === this.safetile || chaserdirections[1].index === 8) {
                                this.chaserSetAndMove(i, 1);
                                counter = 10;
                                var done = true;
                               
                            }
                        }
                    }
                        else {
                             if (yDiff > 0) {
                                if (chaserdirections[2].index === this.safetile || chaserdirections[2].index === 8) {
                                    this.chaserSetAndMove(i, 2);
                                    counter = 10;
                                    var done = true;
      
                                }
                            }
                        else {
                             if (chaserdirections[0].index === this.safetile || chaserdirections[0].index === 8) {
                                this.chaserSetAndMove(i, 0);
                                counter = 10;
                                var done = true;
                            }
                        }
                    }

                    if (this.math.fuzzyEqual(chaser.body.x, Utilities.tileToPixels(home.x), this.AIthreshold) && this.math.fuzzyEqual(chaser.body.y, Utilities.tileToPixels(home.y +1), this.AIthreshold)) {
                        chaserReturn = false;
                    }

                }
                else {


                    var rand = Math.floor((Math.random() * 4) + 1)

                    var xDiff = this.pacman.body.x - chaser.body.x;
                    var yDiff = this.pacman.body.y - chaser.body.y;

                    if (Math.abs(xDiff) < 125 || Math.abs(yDiff) < 125) {
                        if (Math.abs(xDiff) > Math.abs(yDiff)) {
                            if (xDiff > 0) {
                                if (chaserdirections[3].index === this.safetile || chaserdirections[3].index === 8) {
                                    this.chaserSetAndMove(i, 3);
                                    counter = 10;
                                    var done = true;
                                    break;
                                }
                            }
                            else {
                                if (chaserdirections[1].index === this.safetile || chaserdirections[1].index === 8) {
                                    this.chaserSetAndMove(i, 1);
                                    counter = 10;
                                    var done = true;
                                    break;
                                }
                            }
                        }
                        else {
                            if (yDiff > 0) {
                                if (chaserdirections[2].index === this.safetile || chaserdirections[2].index === 8) {
                                    this.chaserSetAndMove(i, 2);
                                    counter = 10;
                                    var done = true;
                                    break;
                                }
                            }
                            else {
                                if (chaserdirections[0].index === this.safetile || chaserdirections[0].index === 8) {
                                    this.chaserSetAndMove(i, 0);
                                    counter = 10;
                                    var done = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        for (var k = 0; k < 4;) {
                            if (rand % 4 !== chaserComingFrom) {
                                if (chaserdirections[rand % 4].index === this.safetile || chaserdirections[rand % 4].index === 8) {
                                    tempDir = rand % 4;
                                    this.chaserSetAndMove(i, tempDir);
                                    counter = 10;
                                    var done = true;
                                    break;
                                }

                            }
                            rand++;
                            k++;
                        }
                    }
                }
                


            }
            i++;

            if (done) {
                done = false;
                break;
            }
        }
    },


    chasermove: function (direction) {
        if (direction === Utilities.Up) {
            chaser.body.velocity.y = -(Utilities.Speed);
            chaser.body.velocity.x = 0;
            chaserComingFrom = Utilities.Down;

        }
        else if (direction === Utilities.Down) {
            chaser.body.velocity.y = (Utilities.Speed);
            chaser.body.velocity.x = 0;
            chaserComingFrom = Utilities.Up;
        }
        else if (direction === Utilities.Left) {
            chaser.body.velocity.x = -(Utilities.Speed);
            chaser.body.velocity.y = 0;
            chaserComingFrom = Utilities.Right;
        }
        else if (direction === Utilities.Right) {
            chaser.body.velocity.x = (Utilities.Speed);
            chaser.body.velocity.y = 0;
            chaserComingFrom = Utilities.Left;
        }
    },



    chaserSetAndMove: function (decisionIndex, pushDirection) {
        chaser.body.x = Utilities.tileToPixels(decisionPoints[decisionIndex].x);
        chaser.body.y = Utilities.tileToPixels(decisionPoints[decisionIndex].y);
        this.chasermove(pushDirection);

    },

    //GUARD 2

    racerAI: function () {

        racermarker.x = this.math.snapToFloor(Math.floor(racer.x), this.gridsize) / this.gridsize;
        racermarker.y = this.math.snapToFloor(Math.floor(racer.y), this.gridsize) / this.gridsize;

        racerdirections[Utilities.Up] = map.getTileAbove(map.getLayer(), racermarker.x, racermarker.y);
        racerdirections[Utilities.Left] = map.getTileLeft(map.getLayer(), racermarker.x, racermarker.y);
        racerdirections[Utilities.Down] = map.getTileBelow(map.getLayer(), racermarker.x, racermarker.y);
        racerdirections[Utilities.Right] = map.getTileRight(map.getLayer(), racermarker.x, racermarker.y);


        //STUCK IN A CORNER
        if (racer.body.velocity.x === 0 && racer.body.velocity.y === 0) {

            for (var i = Utilities.Up; i < 4;) {
                if (i !== racerComingFrom) {
                    if (racerdirections[i].index === this.safetile || racerdirections[i].index === 8) {
                        this.racermove(i);
                        break;
                    }

                }
                i++;
            }
        }

        //DECISION TIME

        for (var i = 0; i < decisionPoints.length;) {

            if (this.math.fuzzyEqual(racer.body.x, Utilities.tileToPixels(decisionPoints[i].x), this.AIthreshold) && this.math.fuzzyEqual(racer.body.y, Utilities.tileToPixels(decisionPoints[i].y), this.AIthreshold)) {
                var rand = Math.floor((Math.random() * 4) + 1)

                var xDiff = this.pacman.body.x - racer.body.x;
                var yDiff = this.pacman.body.y - racer.body.y;
        
                if (Math.abs(xDiff) < 125 || Math.abs(yDiff) < 125) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (racerdirections[3].index === this.safetile || racerdirections[3].index === 8) {
                                this.racerSetAndMove(i, 3);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                        else {
                            if (racerdirections[1].index === this.safetile || racerdirections[1].index === 8) {
                                this.racerSetAndMove(i, 1);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                    }
                    else {
                        if (yDiff > 0) {
                            if (racerdirections[2].index === this.safetile || racerdirections[2].index === 8) {
                                this.racerSetAndMove(i, 2);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                        else {
                            if (racerdirections[0].index === this.safetile || racerdirections[0].index === 8) {
                                this.racerSetAndMove(i, 0);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    for (var k = 0; k < 4;) {
                        if (rand % 4 !== racerComingFrom) {
                            if (racerdirections[rand % 4].index === this.safetile || racerdirections[rand % 4].index === 8) {
                                tempDir = rand % 4;
                                this.racerSetAndMove(i, tempDir);
                                counter2 = 10;
                                var done = true;
                                break;
                            }

                        }
                        rand++;
                        k++;
                    }
                }



            }
            i++;

            if (done) {
                done = false;
                break;
            }
        }
    },


    racermove: function (direction) {
        if (direction === Utilities.Up) {
            racer.body.velocity.y = -(Utilities.Speed);
            racer.body.velocity.x = 0;
            racerComingFrom = Utilities.Down;

        }
        else if (direction === Utilities.Down) {
            racer.body.velocity.y = (Utilities.Speed);
            racer.body.velocity.x = 0;
            racerComingFrom = Utilities.Up;
        }
        else if (direction === Utilities.Left) {
            racer.body.velocity.x = -(Utilities.Speed);
            racer.body.velocity.y = 0;
            racerComingFrom = Utilities.Right;
        }
        else if (direction === Utilities.Right) {
            racer.body.velocity.x = (Utilities.Speed);
            racer.body.velocity.y = 0;
            racerComingFrom = Utilities.Left;
        }
    },



    racerSetAndMove: function (decisionIndex, pushDirection) {
        racer.body.x = Utilities.tileToPixels(decisionPoints[decisionIndex].x);
        racer.body.y = Utilities.tileToPixels(decisionPoints[decisionIndex].y);
        this.racermove(pushDirection);

    },

    checkExitCollision: function () {
        if (this.pacman.x == nwExit.x + 12 && this.pacman.y == nwExit.y + 36) {
            if (nwExitState == ExitState.OPEN) {
                console.log("Took nw exit!");
            }
        }

        else if (this.pacman.x == neExit.x + 12 && this.pacman.y == neExit.y + 36) {
            if (neExitState == ExitState.OPEN) {
                console.log("Took ne exit!");
            }
        }

        else if (this.pacman.x == swExit.x + 12 && this.pacman.y == swExit.y + 36) {
            if (swExitState == ExitState.OPEN) {
                console.log("Took sw exit!");
            }
        }

        else if (this.pacman.x == seExit.x + 12 && this.pacman.y == seExit.y + 36) {
            if (seExitState == ExitState.OPEN) {
                console.log("Took se exit!");
            }
        }
    },


    //GUARD 3

    tracerAI: function () {

        tracermarker.x = this.math.snapToFloor(Math.floor(tracer.x), this.gridsize) / this.gridsize;
        tracermarker.y = this.math.snapToFloor(Math.floor(tracer.y), this.gridsize) / this.gridsize;

        tracerdirections[Utilities.Up] = map.getTileAbove(map.getLayer(), tracermarker.x, tracermarker.y);
        tracerdirections[Utilities.Left] = map.getTileLeft(map.getLayer(), tracermarker.x, tracermarker.y);
        tracerdirections[Utilities.Down] = map.getTileBelow(map.getLayer(), tracermarker.x, tracermarker.y);
        tracerdirections[Utilities.Right] = map.getTileRight(map.getLayer(), tracermarker.x, tracermarker.y);


        //STUCK IN A CORNER
        if (tracer.body.velocity.x === 0 && tracer.body.velocity.y === 0) {

            for (var i = Utilities.Up; i < 4;) {
                if (i !== tracerComingFrom) {
                    if (tracerdirections[i].index === this.safetile || tracerdirections[i].index === 8) {
                        this.tracermove(i);
                        break;
                    }

                }
                i++;
            }
        }

        for (var i = 0; i < decisionPoints.length;) {

            if (this.math.fuzzyEqual(tracer.body.x, Utilities.tileToPixels(decisionPoints[i].x), this.AIthreshold) && this.math.fuzzyEqual(tracer.body.y, Utilities.tileToPixels(decisionPoints[i].y), this.AIthreshold)) {
                var rand = Math.floor((Math.random() * 4) + 1)

                var xDiff = this.pacman.body.x - tracer.body.x;
                var yDiff = this.pacman.body.y - tracer.body.y;

                if (Math.abs(xDiff) < 125 || Math.abs(yDiff) < 125) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (tracerdirections[3].index === this.safetile || tracerdirections[3].index === 8) {
                                this.tracerSetAndMove(i, 3);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                        else {
                            if (tracerdirections[1].index === this.safetile || tracerdirections[1].index === 8) {
                                this.tracerSetAndMove(i, 1);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                    }
                    else {
                        if (yDiff > 0) {
                            if (tracerdirections[2].index === this.safetile || tracerdirections[2].index === 8) {
                                this.tracerSetAndMove(i, 2);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                        else {
                            if (tracerdirections[0].index === this.safetile || tracerdirections[0].index === 8) {
                                this.tracerSetAndMove(i, 0);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    for (var k = 0; k < 4;) {
                        if (rand % 4 !== tracerComingFrom) {
                            if (tracerdirections[rand % 4].index === this.safetile || tracerdirections[rand % 4].index === 8) {
                                tempDir = rand % 4;
                                this.tracerSetAndMove(i, tempDir);
                                counter2 = 10;
                                var done = true;
                                break;
                            }

                        }
                        rand++;
                        k++;
                    }
                }



            }
            i++;

            if (done) {
                done = false;
                break;
            }
        }
    },


    tracermove: function (direction) {
        if (direction === Utilities.Up) {
            tracer.body.velocity.y = -(Utilities.Speed);
            tracer.body.velocity.x = 0;
            tracerComingFrom = Utilities.Down;

        }
        else if (direction === Utilities.Down) {
            tracer.body.velocity.y = (Utilities.Speed);
            tracer.body.velocity.x = 0;
            tracerComingFrom = Utilities.Up;
        }
        else if (direction === Utilities.Left) {
            tracer.body.velocity.x = -(Utilities.Speed);
            tracer.body.velocity.y = 0;
            tracerComingFrom = Utilities.Right;
        }
        else if (direction === Utilities.Right) {
            tracer.body.velocity.x = (Utilities.Speed);
            tracer.body.velocity.y = 0;
            tracerComingFrom = Utilities.Left;
        }
    },



    tracerSetAndMove: function (decisionIndex, pushDirection) {
        tracer.body.x = Utilities.tileToPixels(decisionPoints[decisionIndex].x);
        tracer.body.y = Utilities.tileToPixels(decisionPoints[decisionIndex].y);
        this.tracermove(pushDirection);

    },

    //GUARD 4

    caribouAI: function () {

        cariboumarker.x = this.math.snapToFloor(Math.floor(caribou.x), this.gridsize) / this.gridsize;
        cariboumarker.y = this.math.snapToFloor(Math.floor(caribou.y), this.gridsize) / this.gridsize;

        cariboudirections[Utilities.Up] = map.getTileAbove(map.getLayer(), cariboumarker.x, cariboumarker.y);
        cariboudirections[Utilities.Left] = map.getTileLeft(map.getLayer(), cariboumarker.x, cariboumarker.y);
        cariboudirections[Utilities.Down] = map.getTileBelow(map.getLayer(), cariboumarker.x, cariboumarker.y);
        cariboudirections[Utilities.Right] = map.getTileRight(map.getLayer(), cariboumarker.x, cariboumarker.y);


        //STUCK IN A CORNER
        if (caribou.body.velocity.x === 0 && caribou.body.velocity.y === 0) {

            for (var i = Utilities.Up; i < 4;) {
                if (i !== caribouComingFrom) {
                    if (cariboudirections[i].index === this.safetile || cariboudirections[i].index === 8) {
                        this.cariboumove(i);
                        break;
                    }

                }
                i++;
            }
        }



        for (var i = 0; i < decisionPoints.length;) {

            if (this.math.fuzzyEqual(caribou.body.x, Utilities.tileToPixels(decisionPoints[i].x), this.AIthreshold) && this.math.fuzzyEqual(caribou.body.y, Utilities.tileToPixels(decisionPoints[i].y), this.AIthreshold)) {
                var rand = Math.floor((Math.random() * 4) + 1)

                var xDiff = this.pacman.body.x - caribou.body.x;
                var yDiff = this.pacman.body.y - caribou.body.y;

                if (Math.abs(xDiff) < 125 || Math.abs(yDiff) < 125) {
                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (cariboudirections[3].index === this.safetile || cariboudirections[3].index === 8) {
                                this.caribouSetAndMove(i, 3);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                        else {
                            if (cariboudirections[1].index === this.safetile || cariboudirections[1].index === 8) {
                                this.caribouSetAndMove(i, 1);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                    }
                    else {
                        if (yDiff > 0) {
                            if (cariboudirections[2].index === this.safetile || cariboudirections[2].index === 8) {
                                this.caribouSetAndMove(i, 2);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                        else {
                            if (cariboudirections[0].index === this.safetile || cariboudirections[0].index === 8) {
                                this.caribouSetAndMove(i, 0);
                                counter2 = 10;
                                var done = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    for (var k = 0; k < 4;) {
                        if (rand % 4 !== caribouComingFrom) {
                            if (cariboudirections[rand % 4].index === this.safetile || cariboudirections[rand % 4].index === 8) {
                                tempDir = rand % 4;
                                this.caribouSetAndMove(i, tempDir);
                                counter2 = 10;
                                var done = true;
                                break;
                            }

                        }
                        rand++;
                        k++;
                    }
                }



            }
            i++;

            if (done) {
                done = false;
                break;
            }
        }
    },


    cariboumove: function (direction) {
        if (direction === Utilities.Up) {
            caribou.body.velocity.y = -(Utilities.Speed);
            caribou.body.velocity.x = 0;
            caribouComingFrom = Utilities.Down;

        }
        else if (direction === Utilities.Down) {
            caribou.body.velocity.y = (Utilities.Speed);
            caribou.body.velocity.x = 0;
            caribouComingFrom = Utilities.Up;
        }
        else if (direction === Utilities.Left) {
            caribou.body.velocity.x = -(Utilities.Speed);
            caribou.body.velocity.y = 0;
            caribouComingFrom = Utilities.Right;
        }
        else if (direction === Utilities.Right) {
            caribou.body.velocity.x = (Utilities.Speed);
            caribou.body.velocity.y = 0;
            caribouComingFrom = Utilities.Left;
        }
    },



    caribouSetAndMove: function (decisionIndex, pushDirection) {
        caribou.body.x = Utilities.tileToPixels(decisionPoints[decisionIndex].x);
        caribou.body.y = Utilities.tileToPixels(decisionPoints[decisionIndex].y);
        this.cariboumove(pushDirection);

    },

    checkExitCollision: function () {
        if (this.pacman.x == nwExit.x + 12 && this.pacman.y == nwExit.y + 36) {
            if (nwExitState == ExitState.OPEN) {
                console.log("Took nw exit!");
            }
        }

        else if (this.pacman.x == neExit.x + 12 && this.pacman.y == neExit.y + 36) {
            if (neExitState == ExitState.OPEN) {
                console.log("Took ne exit!");
            }
        }

        else if (this.pacman.x == swExit.x + 12 && this.pacman.y == swExit.y + 36) {
            if (swExitState == ExitState.OPEN) {
                console.log("Took sw exit!");
            }
        }

        else if (this.pacman.x == seExit.x + 12 && this.pacman.y == seExit.y + 36) {
            if (seExitState == ExitState.OPEN) {
                console.log("Took se exit!");
            }
        }
    },

    powerPellet: function(){
        powerCounter = 1000
        poweredUp = true;
        chaserReturn = true;
        racerReturn = true;
        tracerReturn = true;
        caribouReturn = true;

    },


    update: function () {

        this.physics.arcade.collide(this.pacman, mapLayer);
        this.game.physics.arcade.collide(this.guard, mapLayer);
        this.game.physics.arcade.collide(chaser, mapLayer);
        this.game.physics.arcade.collide(racer, mapLayer);
        this.game.physics.arcade.collide(tracer, mapLayer);
        this.game.physics.arcade.collide(caribou, mapLayer);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);

        if (this.physics.arcade.overlap(this.pacman, this.stairs)) {
            this.teleport();
        }
        else {
            this.justTeleported = false;
        }

        if (this.physics.arcade.overlap(this.pacman, this.spray)) {
            this.powerPellet();
        }
        else {
            powerCounter--;
        }


        UpdateExit();
        this.checkExitCollision();


        this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
        //  Update our grid sensors
        this.directions[1] = map.getTileLeft(mapLayer.index, this.marker.x, this.marker.y);
        this.directions[2] = map.getTileRight(mapLayer.index, this.marker.x, this.marker.y);
        this.directions[3] = map.getTileAbove(mapLayer.index, this.marker.x, this.marker.y);
        this.directions[4] = map.getTileBelow(mapLayer.index, this.marker.x, this.marker.y);
        this.checkKeys();
        if (this.turning !== Phaser.NONE) {
            this.turn();
        }




        if (counter === 0) {
            this.ghostAI();
        }
        else {
            counter--;
        }

        if (counter2 === 0) {
            this.racerAI();
        }
        else {
            counter2--;
        }

        if (counter2 === 0) {
            this.tracerAI();
        }
        else {
            counter2--;
        }

        if (counter2 === 0) {
            this.caribouAI();
        }
        else {
            counter2--;
        }



        this.physics.arcade.overlap(this.pacman, racer, this.die, null, this);
        this.physics.arcade.overlap(this.pacman, chaser, this.die, null, this);
        this.physics.arcade.overlap(this.pacman, tracer, this.die, null, this);
        this.physics.arcade.overlap(this.pacman, caribou, this.die, null, this);
    }
}

game.state.add('Game', Pacman, true);
game.state.add('Title', titleState);
game.state.add('GameOver', gameOverState);
game.state.start('Title');
