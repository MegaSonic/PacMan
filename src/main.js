
var game = new Phaser.Game(928, 816, Phaser.AUTO);

var map, mapLayer, secondLayer;

var score = 0;
var dollarScore;
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
var home = new Phaser.Point(16 + 3, 16)
var levelWin = false;
var stage = 1;
var sprintButton;
var sprintCounter;
var topRightAlarm;
var topLeftAlarm;
var bottomLeftAlarm;
var bottomRightAlarm;
var topRightAlarmUsed;
var topLeftAlarmUsed;
var bottomLeftAlarmUsed;
var bottomRightAlarmUsed;

var requiredDots = 100;
var currentDots = 0;

var leftStairs = new Phaser.Point(1 + 3, 16);
var rightStairs = new Phaser.Point(30 + 3, 16);
var house;

var PlayerState = { MALE: false, FEMALE: true };
var playerGender = PlayerState.MALE;

var leftRails;
var rightRails;

var redTint;

var fireSound;
var startingSound;
var gameOverSound;
var musicLoop;

//CHASER VARS
var chaser;
var chaserdirections = [null, null, null, null, null];
var chaserComingFrom = Utilities.Left;
var chasermarker = new Phaser.Point();
var chaserReturn = false;
var chaserSpeed;
var chaserState;


//RACER VARS
var racer;
var racerdirections = [null, null, null, null, null];
var racerComingFrom = Utilities.Right;
var racermarker = new Phaser.Point();
var racerReturn = false;
var racerSpeed;

//TRACER VARS
var tracer;
var tracerdirections = [null, null, null, null, null];
var tracerComingFrom = Utilities.Left;
var tracermarker = new Phaser.Point();
var tracerReturn = false;
var tracerSpeed;
var tracerMad;

//CARIBOU
var caribou;
var cariboudirections = [null, null, null, null, null];
var caribouComingFrom = Utilities.Right;
var cariboumarker = new Phaser.Point();
var caribouReturn = false;
var caribouSpeed;
var cariboyMad;

var decisionPoints = [new Phaser.Point(8 + 3, 1), new Phaser.Point(11 + 3, 1), new Phaser.Point(20 + 3, 1), new Phaser.Point(23 + 3, 1),
    new Phaser.Point(2 + 3, 4), new Phaser.Point(29 + 3, 4),
    new Phaser.Point(8 + 3, 7), new Phaser.Point(11 + 3, 7), new Phaser.Point(14 + 3, 7), new Phaser.Point(17 + 3, 7), new Phaser.Point(20 + 3, 7), new Phaser.Point(23 + 3, 7),
    new Phaser.Point(8 + 3, 10), new Phaser.Point(23 + 3, 10),
    new Phaser.Point(14 + 3, 13), new Phaser.Point(17 + 3, 13),
    new Phaser.Point(11 + 3, 19), new Phaser.Point(20 + 3, 19),
    new Phaser.Point(8 + 3, 22), new Phaser.Point(11 + 3, 22), new Phaser.Point(20 + 3, 22), new Phaser.Point(23 + 3, 22),
    new Phaser.Point(2 + 3, 25), new Phaser.Point(8 + 3, 25), new Phaser.Point(11 + 3, 25), new Phaser.Point(14 + 3, 25), new Phaser.Point(17 + 3, 25), new Phaser.Point(20 + 3, 25), new Phaser.Point(23 + 3, 25), new Phaser.Point(29 + 3, 25),
    new Phaser.Point(2 + 3, 28), new Phaser.Point(7 + 3, 28), new Phaser.Point(11 + 3, 28), new Phaser.Point(14 + 3, 28), new Phaser.Point(17 + 3, 28), new Phaser.Point(20 + 3, 28), new Phaser.Point(25 + 3, 28), new Phaser.Point(29 + 3, 28),
	new Phaser.Point(7 + 3, 32), new Phaser.Point(11 + 3, 32), new Phaser.Point(14 + 3, 32), new Phaser.Point(17 + 3, 32), new Phaser.Point(20 + 3, 32), new Phaser.Point(25 + 3, 32) ];

var Pacman = function (game) {

    this.map = null;
    this.pacman = null;
    this.comingFrom = Utilities.Right;


    this.safetile = 17;
    this.gridsize = 24;

    this.speed = 120;
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

    



    preload: function () {

        
        this.load.image('dot', 'assets/dot.png');
        this.load.image('coin', 'assets/coin2.png');

        //this.load.tilemap('map', 'assets/pac_maze.json', null, Phaser.Tilemap.TILED_JSON);
        //this.load.image('tiles', 'assets/tile_set.png');

        this.load.tilemap('map', 'assets/pac_maze_final.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tile_set_full.png');

        this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
        this.load.image('ghost', 'assets/ghost.png');
        game.load.image('pinky', 'assets/pinky.png');
        game.load.image('leftStairs', 'assets/stairs_01.png');
        game.load.image('rightStairs', 'assets/stairs_02.png');
        game.load.spritesheet('exitLights', 'assets/exitLightsNew.png', 24, 24);
        game.load.spritesheet('playerm', 'assets/playerm.png', 40, 40);
        game.load.spritesheet('playerf', 'assets/playerf.png', 40, 40);
        game.load.image('chaser', 'assets/chaser.png');
        game.load.image('house', 'assets/Guard_station.png');
        game.load.image('rails', 'assets/Rails.png');
        game.load.image('train', 'assets/Train_front.png');
        game.load.spritesheet('guard', 'assets/police.png', 40, 40);
        game.load.image('redTint', 'assets/redTint.png');
        game.load.image('alarmUsed', 'assets/alarmUsed.png');
    },

    

    create: function () {



        this.stage.backgroundColor = '#000000';
        map = game.add.tilemap('map');
        map.addTilesetImage('tile_set_full', 'tiles');
        mapLayer = map.createLayer('Tile Layer 1');
        secondLayer = map.createLayer('Tile Layer 2');
        mapLayer.resizeWorld();

        topLeftAlarmUsed = this.add.sprite((8 * 24), (3 * 24), 'alarmUsed', 0);
        topRightAlarmUsed = this.add.sprite((29 * 24), (3 * 24), 'alarmUsed', 0);
        bottomLeftAlarmUsed = this.add.sprite((10 * 24), (27 * 24), 'alarmUsed', 0);
        bottomRightAlarmUsed = this.add.sprite((28 * 24), (27 * 24), 'alarmUsed', 0);

        topLeftAlarmUsed.kill();
        topRightAlarmUsed.kill();
        bottomLeftAlarmUsed.kill();
        bottomRightAlarmUsed.kill();

        this.dots = this.add.physicsGroup();
        map.createFromTiles(21, 17, 'coin', secondLayer, this.dots);

        //  The dots will need to be offset by 12px to put them back in the middle of the grid
        //this.dots.setAll('x', 12, false, false, 1);
        //this.dots.setAll('y', 12, false, false, 1);

        this.spray = this.add.physicsGroup();
        map.createFromTiles(4, 4, 'dot', mapLayer, this.spray);

        map.setCollisionByExclusion([this.safetile, 21, 4, 24, 28], true, mapLayer);
        map.setCollision(32,true,mapLayer)

        this.pacman = this.add.sprite((6 * 24) + 12, (1 * 24) + 12, 'playerm', 0);
        this.pacman.anchor.set(0.5);
        this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);
        this.pacman.animations.add('walkDown', [0, 1, 2, 3], 12, true);
        this.pacman.animations.add('walkRight', [8, 9, 10, 11], 12, true);
        this.pacman.animations.add('walkUp', [4, 5, 6, 7], 12, true);

        this.physics.arcade.enable(this.pacman);
        this.pacman.body.setSize(24, 24, 0, 0);
        this.cursors = this.input.keyboard.createCursorKeys();


        topLeftAlarm = true;
        topRightAlarm = true;
        bottomLeftAlarm = true;
        bottomRightAlarm = true;


        leftRails = game.add.sprite(-5, 0, 'rails', 0);
        rightRails = game.add.sprite(840, 0, 'rails', 0);

        sprintButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        sprintButton.onDown.add(this.sprint, this);

        this.pacman.play('walkRight');
        this.move(Phaser.RIGHT);

        house = this.add.sprite((this.gridsize * (12  + 3)), (this.gridsize * (14)), 'house', 0);

        // GUARD 1
        chaser = this.add.sprite((this.gridsize * (2  + 3)) + 12, (this.gridsize * (10)) + 12, 'guard', 0);
        chaser.anchor.set(0.5);
        this.game.physics.enable(chaser, Phaser.Physics.ARCADE);
        chaser.body.setSize(24, 24, 0, 0);
        chaser.animations.add('walkDownBored', [0, 1, 2, 3], 12, true);
        chaser.animations.add('walkUpBored', [4, 5, 6, 7], 12, true);
        chaser.animations.add('walkRightBored', [8, 9, 10, 11], 12, true);
        chaser.animations.add('walkDownAngry', [12, 13, 14, 15], 12, true);
        chaser.animations.add('walkUpAngry', [16, 17, 18, 19], 12, true);
        chaser.animations.add('walkRightAngry', [20, 21, 22, 23], 12, true);
        chaser.animations.add('walkDownShocked', [24, 25, 26, 27], 12, true);
        chaser.animations.add('walkUpShocked', [28, 29, 30, 31], 12, true);
        chaser.animations.add('walkRightShocked', [32, 33, 34, 35], 12, true);
        chaser.body.velocity.x = Utilities.Speed2;
        chaser.play('walkRightBored');

        // GUARD 2
        racer = this.add.sprite((this.gridsize * (29  + 3)) + 12, (this.gridsize * (4)) + 12, 'guard', 0);
        racer.anchor.set(0.5);
        this.game.physics.enable(racer, Phaser.Physics.ARCADE);
        racer.body.setSize(24, 24, 0, 0);
        racer.animations.add('walkDownBored', [0, 1, 2, 3], 12, true);
        racer.animations.add('walkUpBored', [4, 5, 6, 7], 12, true);
        racer.animations.add('walkRightBored', [8, 9, 10, 11], 12, true);
        racer.animations.add('walkDownAngry', [12, 13, 14, 15], 12, true);
        racer.animations.add('walkUpAngry', [16, 17, 18, 19], 12, true);
        racer.animations.add('walkRightAngry', [20, 21, 22, 23], 12, true);
        racer.animations.add('walkDownShocked', [24, 25, 26, 27], 12, true);
        racer.animations.add('walkUpShocked', [28, 29, 30, 31], 12, true);
        racer.animations.add('walkRightShocked', [32, 33, 34, 35], 12, true);
        racer.body.velocity.x = -Utilities.Speed2;
        racer.scale.x = -1;
        racer.play('walkRightBored');

        // GUARD 3
        tracer = this.add.sprite((this.gridsize * (2  + 3)) + 12, (this.gridsize * (28)) + 12, 'guard', 0);
        tracer.anchor.set(0.5);
        this.game.physics.enable(tracer, Phaser.Physics.ARCADE);
        tracer.body.setSize(24, 24, 0, 0);
        tracer.animations.add('walkDownBored', [0, 1, 2, 3], 12, true);
        tracer.animations.add('walkUpBored', [4, 5, 6, 7], 12, true);
        tracer.animations.add('walkRightBored', [8, 9, 10, 11], 12, true);
        tracer.animations.add('walkDownAngry', [12, 13, 14, 15], 12, true);
        tracer.animations.add('walkUpAngry', [16, 17, 18, 19], 12, true);
        tracer.animations.add('walkRightAngry', [20, 21, 22, 23], 12, true);
        tracer.animations.add('walkDownShocked', [24, 25, 26, 27], 12, true);
        tracer.animations.add('walkUpShocked', [28, 29, 30, 31], 12, true);
        tracer.animations.add('walkRightShocked', [32, 33, 34, 35], 12, true);
        tracer.body.velocity.x = Utilities.Speed2;
        tracer.play('walkRightBored');

        // GUARD 4
        caribou = this.add.sprite((this.gridsize * (29  + 3)) + 12, (this.gridsize * (28)) + 12, 'guard', 0);
        caribou.anchor.set(0.5);
        this.game.physics.enable(caribou, Phaser.Physics.ARCADE);
        caribou.body.setSize(24, 24, 0, 0);
        caribou.animations.add('walkDownBored', [0, 1, 2, 3], 12, true);
        caribou.animations.add('walkUpBored', [4, 5, 6, 7], 12, true);
        caribou.animations.add('walkRightBored', [8, 9, 10, 11], 12, true);
        caribou.animations.add('walkDownAngry', [12, 13, 14, 15], 12, true);
        caribou.animations.add('walkUpAngry', [16, 17, 18, 19], 12, true);
        caribou.animations.add('walkRightAngry', [20, 21, 22, 23], 12, true);
        caribou.animations.add('walkDownShocked', [24, 25, 26, 27], 12, true);
        caribou.animations.add('walkUpShocked', [28, 29, 30, 31], 12, true);
        caribou.animations.add('walkRightShocked', [32, 33, 34, 35], 12, true);
        caribou.body.velocity.x = -Utilities.Speed2;
        caribou.scale.x = -1;
        caribou.play('walkRightBored');


        


        if (playerGender == PlayerState.MALE) {
            this.pacman.loadTexture('playerm', 0);
        }
        else {
            this.pacman.loadTexture('playerf', 0);
        }

        this.pacman.play('walkRight');

        StartExit();

        redTint = this.add.sprite(0, 0, 'redTint', 0);
        redTint.kill();

        fireSound = game.add.audio('fire');

        text = game.add.text(100, 0, score, { font: "24px Arial", fill: "#ff0044", align: "center" });
        livesText = game.add.text(800, 0, this.lives, { font: "24px Arial", fill: "#ff0044", align: "center" });


        textGroup = game.add.group();
        textGroup.add(text);

        musicLoop.loop = true;
        musicLoop.play();
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
            if (!(this.directions[turnTo].index == 8 || this.directions[turnTo].index == 4 || this.directions[turnTo].index == 5 || this.directions[turnTo].index == 32)) {
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

    sprint: function () {

        this.pacman.body.velocity.x = this.pacman.body.velocity.x * 1.5;
        this.pacman.body.velocity.y = this.pacman.body.velocity.y * 1.5;
        this.speed = 180;
        sprintCounter = 600;

    },

    eatDot: function (pacman, dot) {
        dot.kill();
        if (this.dots.total === 0) {
            this.dots.callAll('revive');
        }
        score += 0.1
        dollarScore = score.toFixed(2)
        currentDots++;
        // console.log(currentDots);

        text.text = '$' + dollarScore;

        if (currentDots > requiredDots) {
            text.setStyle({ font: "24px Arial", fill: "#00ff00", align: "center" });
        }
    },

    die: function () {

        if (levelWin === true) {
            levelWin = false;
            stage++;
            if (requiredDots < 175) {
                requiredDots += 25;
                
            }
            fireSound.stop();
            redTint.kill();
            currentDots = 0;
            score = 0;
            text.setStyle({ font: "24px Arial", fill: "#ff0000", align: "center" });
            
            game.state.start('Game');


            
            topLeftAlarm = true;
            topRightAlarm = true;
            bottomRightAlarm = true;
            bottomTopAlarm = true;

            topLeftAlarmUsed.kill();
            topRightAlarmUsed.kill();
            bottomLeftAlarmUsed.kill();
            bottomRightAlarmUsed.kill();

            
        }
        else {
            this.lives--;
            fireSound.stop();
            redTint.kill();

            if (this.lives < 1) {
                this.lives = 3;
                currentDots = 0;
                score = 0;
                requiredDots = 100;
                musicLoop.stop();
                fireSound.stop();
                redTint.kill();
                game.state.start('GameOver');
                //game.add.text(game.world.centerX, game.world.centerY - 200, "Game Over", { font: "48px Arial", fill: "#ff0044", align: "center" });
                // textGroup.add.text(game.world.centerX, game.world.centerY - 200, "Game Over", { font: "48px Arial", fill: "#ffffff", align: "center" });
                //this.pacman.kill();
            }
        }

        // this.dots.callAll('revive');
        this.pacman.x = (6 * this.gridsize) + this.gridsize / 2;
        this.pacman.y = (1 * this.gridsize) + this.gridsize / 2;
        this.move(Phaser.RIGHT);

        chaser.body.x = (this.gridsize * (2 + 3)) + 12; 
        chaser.body.y = (this.gridsize * 10) + 12;
        chaser.body.velocity.x = Utilities.Speed2;
        chaser.play('walkRightBored');

        racer.body.x = (this.gridsize * (29 + 3)) + 12;
        racer.body.y = (this.gridsize * 4) + 12;
        racer.body.velocity.x = -Utilities.Speed2;
        racer.scale.x = -1;
        racer.play('walkRightBored');
        

        tracer.body.x = (this.gridsize * (2  + 3)) + 12;
        tracer.body.y = (this.gridsize * 28) + 12;
        tracer.body.velocity.x = Utilities.Speed2;
        tracer.play('walkRightBored');

        caribou.body.x = (this.gridsize * (29 + 3)) + 12;
        caribou.body.y = (this.gridsize * 28) + 12;
        caribou.body.velocity.x = -Utilities.Speed2;
        caribou.scale.x = -1;
        caribou.play('walkRightBored');

        
        sprintCounter = 0;

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
            if (this.pacman.x > game.world.centerX) {
                this.pacman.x = ((1 + 3) * this.gridsize) + this.gridsize / 2;
                this.pacman.y = (16 * this.gridsize) + this.gridsize / 2;
                this.move(Phaser.RIGHT);
            }
            else {
                this.pacman.x = ((29 + 3) * this.gridsize) + this.gridsize / 2;
                this.pacman.y = (16 * this.gridsize) + this.gridsize / 2;
                this.move(Phaser.LEFT);
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

                    chaserState = 2;

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

                    if (this.math.fuzzyEqual(chaser.body.y, Utilities.tileToPixels(home.y+3), this.AIthreshold)) {
                        chaserReturn = false;
                    }

                }
                else {

                    var rand = Math.floor((Math.random() * 4) + 1)

                    var xDiff = this.pacman.body.x - chaser.body.x;
                    var yDiff = this.pacman.body.y - chaser.body.y;

                    if (Math.abs(xDiff) < Utilities.Prox && Math.abs(yDiff) < Utilities.Prox) {
                        chaserState = 1;
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
                        chaserState = 0;
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
        chaser.scale.x = 1;
        if (direction === Utilities.Up) {
            chaser.body.velocity.y = -(Utilities.Speed2);
            chaser.body.velocity.x = 0;
            chaserComingFrom = Utilities.Down;
            if(chaserState === 2){
                chaser.play('walkUpShocked');
            }
            else if (chaserState === 1){
                chaser.play('walkUpAngry');
            }
            else{
                chaser.play('walkUpBored');
            }

        }
        else if (direction === Utilities.Down) {
            chaser.body.velocity.y = (Utilities.Speed2);
            chaser.body.velocity.x = 0;
            chaserComingFrom = Utilities.Up;
            if (chaserState === 2) {
                chaser.play('walkDownShocked');
            }
            else if (chaserState === 1) {
                chaser.play('walkDownAngry');
            }
            else {
                chaser.play('walkDownBored');
            }
        }
        else if (direction === Utilities.Left) {
            chaser.body.velocity.x = -(Utilities.Speed2);
            chaser.body.velocity.y = 0;
            chaserComingFrom = Utilities.Right;
            if (chaserState ===2) {
                chaser.scale.x = -1;
                chaser.play('walkRightShocked');
            }
            else if (chaserState === 1) {
                chaser.scale.x = -1;
                chaser.play('walkRightAngry');
            }
            else {
                chaser.scale.x = -1;
                chaser.play('walkRightBored');
            }
        }
        else if (direction === Utilities.Right) {
            chaser.body.velocity.x = (Utilities.Speed2);
            chaser.body.velocity.y = 0;
            chaserComingFrom = Utilities.Left;
            if (chaserState === 2) {
                chaser.play('walkRightShocked');
            }
            else if (chaserState === 1) {
                chaser.play('walkRightAngry');
            }
            else {
                chaser.play('walkRightBored');
            }
        }
    },

    chaserSpeedUp: function(){

        var xDiff = this.pacman.body.x - chaser.body.x;
        var yDiff = this.pacman.body.y - chaser.body.y;
        if ((Math.abs(xDiff) < 125 && Math.abs(yDiff) < 125) || chaserReturn === true){

            if (chaserComingFrom === Utilities.Down) {
                chaser.body.velocity.y = -(Utilities.Speed3);
                chaser.body.velocity.x = 0;

            }
            else if (chaserComingFrom === Utilities.Up) {
                chaser.body.velocity.y = (Utilities.Speed3);
                chaser.body.velocity.x = 0;
            }
            else if (chaserComingFrom === Utilities.Right) {
                chaser.body.velocity.x = -(Utilities.Speed3);
                chaser.body.velocity.y = 0;
            }
            else if (chaserComingFrom === Utilities.Left) {
                chaser.body.velocity.x = (Utilities.Speed3);
                chaser.body.velocity.y = 0;
            }
           

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

                if (racerReturn === true) {

                    racerState = 2;

                    var xDiff = Utilities.tileToPixels(home.x) - racer.body.x;
                    var yDiff = Utilities.tileToPixels(home.y) - racer.body.y;

                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (racerdirections[3].index === this.safetile || racerdirections[3].index === 8) {
                                this.racerSetAndMove(i, 3);
                                counter2 = 10;
                                var done = true;

                            }
                        }
                        else {
                            if (racerdirections[1].index === this.safetile || racerdirections[1].index === 8) {
                                this.racerSetAndMove(i, 1);
                                counter2 = 10;
                                var done = true;

                            }
                        }
                    }
                    else {
                        if (yDiff > 0) {
                            if (racerdirections[2].index === this.safetile || racerdirections[2].index === 8) {
                                this.racerSetAndMove(i, 2);
                                counter2 = 10;
                                var done = true;

                            }
                        }
                        else {
                            if (racerdirections[0].index === this.safetile || racerdirections[0].index === 8) {
                                this.racerSetAndMove(i, 0);
                                counter2 = 10;
                                var done = true;
                            }
                        }
                    }

                    if (this.math.fuzzyEqual(racer.body.y, Utilities.tileToPixels(home.y + 3), this.AIthreshold)) {
                        racerReturn = false;
                    }

                }
                else {

                    var rand = Math.floor((Math.random() * 4) + 1)

                    var xDiff = this.pacman.body.x - racer.body.x;
                    var yDiff = this.pacman.body.y - racer.body.y;

                    if (Math.abs(xDiff) < Utilities.Prox && Math.abs(yDiff) < Utilities.Prox) {
                        racerState = 1;
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
                        racerState = 0;
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



            }
            i++;

            if (done) {
                done = false;
                break;
            }
        }
    },

    racermove: function (direction) {
        racer.scale.x = 1;
        if (direction === Utilities.Up) {
            racer.body.velocity.y = -(Utilities.Speed2);
            racer.body.velocity.x = 0;
            racerComingFrom = Utilities.Down;
            if (racerState === 2) {
                racer.play('walkUpShocked');
            }
            else if (racerState === 1) {
                racer.play('walkUpAngry');
            }
            else {
                racer.play('walkUpBored');
            }

        }
        else if (direction === Utilities.Down) {
            racer.body.velocity.y = (Utilities.Speed2);
            racer.body.velocity.x = 0;
            racerComingFrom = Utilities.Up;
            if (racerState === 2) {
                racer.play('walkDownShocked');
            }
            else if (racerState === 1) {
                racer.play('walkDownAngry');
            }
            else {
                racer.play('walkDownBored');
            }
        }
        else if (direction === Utilities.Left) {
            racer.body.velocity.x = -(Utilities.Speed2);
            racer.body.velocity.y = 0;
            racerComingFrom = Utilities.Right;
            if (racerState === 2) {
                racer.scale.x = -1;
                racer.play('walkRightShocked');
            }
            else if (racerState === 1) {
                racer.scale.x = -1;
                racer.play('walkRightAngry');
            }
            else {
                racer.scale.x = -1;
                racer.play('walkRightBored');
            }
        }
        else if (direction === Utilities.Right) {
            racer.body.velocity.x = (Utilities.Speed2);
            racer.body.velocity.y = 0;
            racerComingFrom = Utilities.Left;
            if (racerState === 2) {
                racer.play('walkRightShocked');
            }
            else if (racerState === 1) {
                racer.play('walkRightAngry');
            }
            else {
                racer.play('walkRightBored');
            }
        }
    },

    racerSpeedUp: function(){

        var xDiff = this.pacman.body.x - racer.body.x;
        var yDiff = this.pacman.body.y - racer.body.y;
        if ((Math.abs(xDiff) < 125 && Math.abs(yDiff) < 125) || racerReturn === true){

            if (racerComingFrom === Utilities.Down) {
                racer.body.velocity.y = -(Utilities.Speed3);
                racer.body.velocity.x = 0;

            }
            else if (racerComingFrom === Utilities.Up) {
                racer.body.velocity.y = (Utilities.Speed3);
                racer.body.velocity.x = 0;
            }
            else if (racerComingFrom === Utilities.Right) {
                racer.body.velocity.x = -(Utilities.Speed3);
                racer.body.velocity.y = 0;
            }
            else if (racerComingFrom === Utilities.Left) {
                racer.body.velocity.x = (Utilities.Speed3);
                racer.body.velocity.y = 0;
            }
           

        }

    },



    racerSetAndMove: function (decisionIndex, pushDirection) {
        racer.body.x = Utilities.tileToPixels(decisionPoints[decisionIndex].x);
        racer.body.y = Utilities.tileToPixels(decisionPoints[decisionIndex].y);
        this.racermove(pushDirection);

    },

    checkStairsCollision: function() {
        if (this.pacman.x == leftStairs.x * 24 + 12 && this.pacman.y == leftStairs.y * 24 + 12) {
            if (!this.justTeleported) {
                //console.log("Took left stairs!");
                this.justTeleported = true;
                this.teleport();
            }
        }
        else if (this.pacman.x == rightStairs.x * 24 + 12 && this.pacman.y == rightStairs.y * 24 + 12) {
            if (!this.justTeleported) {
                //console.log("Took right stairs!");
                this.justTeleported = true;
                this.teleport();
            }
        }
        else {
            this.justTeleported = false;
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

                if (tracerReturn === true) {

                    tracerState = 2;

                    var xDiff = Utilities.tileToPixels(home.x) - tracer.body.x;
                    var yDiff = Utilities.tileToPixels(home.y) - tracer.body.y;

                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (tracerdirections[3].index === this.safetile || tracerdirections[3].index === 8) {
                                this.tracerSetAndMove(i, 3);
                                counter3 = 10;
                                var done = true;

                            }
                        }
                        else {
                            if (tracerdirections[1].index === this.safetile || tracerdirections[1].index === 8) {
                                this.tracerSetAndMove(i, 1);
                                counter3 = 10;
                                var done = true;

                            }
                        }
                    }
                    else {
                        if (yDiff > 0) {
                            if (tracerdirections[2].index === this.safetile || tracerdirections[2].index === 8) {
                                this.tracerSetAndMove(i, 2);
                                counter3 = 10;
                                var done = true;

                            }
                        }
                        else {
                            if (tracerdirections[0].index === this.safetile || tracerdirections[0].index === 8) {
                                this.tracerSetAndMove(i, 0);
                                counter3 = 10;
                                var done = true;
                            }
                        }
                    }

                    if (this.math.fuzzyEqual(tracer.body.y, Utilities.tileToPixels(home.y + 3), this.AIthreshold)) {
                        tracerReturn = false;
                    }

                }
                else {

                    var rand = Math.floor((Math.random() * 4) + 1)

                    var xDiff = this.pacman.body.x - tracer.body.x;
                    var yDiff = this.pacman.body.y - tracer.body.y;

                    if (Math.abs(xDiff) < Utilities.Prox && Math.abs(yDiff) < Utilities.Prox) {
                        tracerState = 1;
                        if (Math.abs(xDiff) > Math.abs(yDiff)) {
                            if (xDiff > 0) {
                                if (tracerdirections[3].index === this.safetile || tracerdirections[3].index === 8) {
                                    this.tracerSetAndMove(i, 3);
                                    counter3 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                            else {
                                if (tracerdirections[1].index === this.safetile || tracerdirections[1].index === 8) {
                                    this.tracerSetAndMove(i, 1);
                                    counter3 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                        }
                        else {
                            if (yDiff > 0) {
                                if (tracerdirections[2].index === this.safetile || tracerdirections[2].index === 8) {
                                    this.tracerSetAndMove(i, 2);
                                    counter3 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                            else {
                                if (tracerdirections[0].index === this.safetile || tracerdirections[0].index === 8) {
                                    this.tracerSetAndMove(i, 0);
                                    counter3 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        tracerState = 0;
                        for (var k = 0; k < 4;) {
                            if (rand % 4 !== tracerComingFrom) {
                                if (tracerdirections[rand % 4].index === this.safetile || tracerdirections[rand % 4].index === 8) {
                                    tempDir = rand % 4;
                                    this.tracerSetAndMove(i, tempDir);
                                    counter3 = 10;
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

    tracermove: function (direction) {
        tracer.scale.x = 1;
        if (direction === Utilities.Up) {
            tracer.body.velocity.y = -(Utilities.Speed2);
            tracer.body.velocity.x = 0;
            tracerComingFrom = Utilities.Down;
            if (tracerState === 2) {
                tracer.play('walkUpShocked');
            }
            else if (tracerState === 1) {
                tracer.play('walkUpAngry');
            }
            else {
                tracer.play('walkUpBored');
            }

        }
        else if (direction === Utilities.Down) {
            tracer.body.velocity.y = (Utilities.Speed2);
            tracer.body.velocity.x = 0;
            tracerComingFrom = Utilities.Up;
            if (tracerState === 2) {
                tracer.play('walkDownShocked');
            }
            else if (tracerState === 1) {
                tracer.play('walkDownAngry');
            }
            else {
                tracer.play('walkDownBored');
            }
        }
        else if (direction === Utilities.Left) {
            tracer.body.velocity.x = -(Utilities.Speed2);
            tracer.body.velocity.y = 0;
            tracerComingFrom = Utilities.Right;
            if (tracerState === 2) {
                tracer.scale.x = -1;
                tracer.play('walkRightShocked');
            }
            else if (tracerState === 1) {
                tracer.scale.x = -1;
                tracer.play('walkRightAngry');
            }
            else {
                tracer.scale.x = -1;
                tracer.play('walkRightBored');
            }
        }
        else if (direction === Utilities.Right) {
            tracer.body.velocity.x = (Utilities.Speed2);
            tracer.body.velocity.y = 0;
            tracerComingFrom = Utilities.Left;
            if (tracerState === 2) {
                tracer.play('walkRightShocked');
            }
            else if (tracerState === 1) {
                tracer.play('walkRightAngry');
            }
            else {
                tracer.play('walkRightBored');
            }
        }
    },


    tracerSpeedUp: function () {

        var xDiff = this.pacman.body.x - tracer.body.x;
        var yDiff = this.pacman.body.y - tracer.body.y;
        if ((Math.abs(xDiff) < 125 && Math.abs(yDiff) < 125) || tracerReturn === true) {

            if (tracerComingFrom === Utilities.Down) {
                tracer.body.velocity.y = -(Utilities.Speed3);
                tracer.body.velocity.x = 0;

            }
            else if (tracerComingFrom === Utilities.Up) {
                tracer.body.velocity.y = (Utilities.Speed3);
                tracer.body.velocity.x = 0;
            }
            else if (tracerComingFrom === Utilities.Right) {
                tracer.body.velocity.x = -(Utilities.Speed3);
                tracer.body.velocity.y = 0;
            }
            else if (tracerComingFrom === Utilities.Left) {
                tracer.body.velocity.x = (Utilities.Speed3);
                tracer.body.velocity.y = 0;
            }


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

                if (caribouReturn === true) {

                    caribouState = 2;

                    var xDiff = Utilities.tileToPixels(home.x) - caribou.body.x;
                    var yDiff = Utilities.tileToPixels(home.y) - caribou.body.y;

                    if (Math.abs(xDiff) > Math.abs(yDiff)) {
                        if (xDiff > 0) {
                            if (cariboudirections[3].index === this.safetile || cariboudirections[3].index === 8) {
                                this.caribouSetAndMove(i, 3);
                                counter4 = 10;
                                var done = true;

                            }
                        }
                        else {
                            if (cariboudirections[1].index === this.safetile || cariboudirections[1].index === 8) {
                                this.caribouSetAndMove(i, 1);
                                counter4 = 10;
                                var done = true;

                            }
                        }
                    }
                    else {
                        if (yDiff > 0) {
                            if (cariboudirections[2].index === this.safetile || cariboudirections[2].index === 8) {
                                this.caribouSetAndMove(i, 2);
                                counter4 = 10;
                                var done = true;

                            }
                        }
                        else {
                            if (cariboudirections[0].index === this.safetile || cariboudirections[0].index === 8) {
                                this.caribouSetAndMove(i, 0);
                                counter4 = 10;
                                var done = true;
                            }
                        }
                    }

                    if (this.math.fuzzyEqual(caribou.body.y, Utilities.tileToPixels(home.y + 3), this.AIthreshold)) {
                        caribouReturn = false;
                    }

                }
                else {

                    var rand = Math.floor((Math.random() * 4) + 1)

                    var xDiff = this.pacman.body.x - caribou.body.x;
                    var yDiff = this.pacman.body.y - caribou.body.y;

                    if (Math.abs(xDiff) < Utilities.Prox && Math.abs(yDiff) < Utilities.Prox) {
                        caribouState = 1;
                        if (Math.abs(xDiff) > Math.abs(yDiff)) {
                            if (xDiff > 0) {
                                if (cariboudirections[3].index === this.safetile || cariboudirections[3].index === 8) {
                                    this.caribouSetAndMove(i, 3);
                                    counter4 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                            else {
                                if (cariboudirections[1].index === this.safetile || cariboudirections[1].index === 8) {
                                    this.caribouSetAndMove(i, 1);
                                    counter4 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                        }
                        else {
                            if (yDiff > 0) {
                                if (cariboudirections[2].index === this.safetile || cariboudirections[2].index === 8) {
                                    this.caribouSetAndMove(i, 2);
                                    counter4 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                            else {
                                if (cariboudirections[0].index === this.safetile || cariboudirections[0].index === 8) {
                                    this.caribouSetAndMove(i, 0);
                                    counter4 = 10;
                                    var done = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        caribouState = 0;
                        for (var k = 0; k < 4;) {
                            if (rand % 4 !== caribouComingFrom) {
                                if (cariboudirections[rand % 4].index === this.safetile || cariboudirections[rand % 4].index === 8) {
                                    tempDir = rand % 4;
                                    this.caribouSetAndMove(i, tempDir);
                                    counter4 = 10;
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

    cariboumove: function (direction) {
        caribou.scale.x = 1;
        if (direction === Utilities.Up) {
            caribou.body.velocity.y = -(Utilities.Speed2);
            caribou.body.velocity.x = 0;
            caribouComingFrom = Utilities.Down;
            if (caribouState === 2) {
                caribou.play('walkUpShocked');
            }
            else if (caribouState === 1) {
                caribou.play('walkUpAngry');
            }
            else {
                caribou.play('walkUpBored');
            }

        }
        else if (direction === Utilities.Down) {
            caribou.body.velocity.y = (Utilities.Speed2);
            caribou.body.velocity.x = 0;
            caribouComingFrom = Utilities.Up;
            if (caribouState === 2) {
                caribou.play('walkDownShocked');
            }
            else if (caribouState === 1) {
                caribou.play('walkDownAngry');
            }
            else {
                caribou.play('walkDownBored');
            }
        }
        else if (direction === Utilities.Left) {
            caribou.body.velocity.x = -(Utilities.Speed2);
            caribou.body.velocity.y = 0;
            caribouComingFrom = Utilities.Right;
            if (caribouState === 2) {
                caribou.scale.x = -1;
                caribou.play('walkRightShocked');
            }
            else if (caribouState === 1) {
                caribou.scale.x = -1;
                caribou.play('walkRightAngry');
            }
            else {
                caribou.scale.x = -1;
                caribou.play('walkRightBored');
            }
        }
        else if (direction === Utilities.Right) {
            caribou.body.velocity.x = (Utilities.Speed2);
            caribou.body.velocity.y = 0;
            caribouComingFrom = Utilities.Left;
            if (caribouState === 2) {
                caribou.play('walkRightShocked');
            }
            else if (caribouState === 1) {
                caribou.play('walkRightAngry');
            }
            else {
                caribou.play('walkRightBored');
            }
        }
    },

    caribouSpeedUp: function () {

        var xDiff = this.pacman.body.x - caribou.body.x;
        var yDiff = this.pacman.body.y - caribou.body.y;
        if ((Math.abs(xDiff) < 125 && Math.abs(yDiff) < 125) || caribouReturn === true) {

            if (caribouComingFrom === Utilities.Down) {
                caribou.body.velocity.y = -(Utilities.Speed3);
                caribou.body.velocity.x = 0;

            }
            else if (caribouComingFrom === Utilities.Up) {
                caribou.body.velocity.y = (Utilities.Speed3);
                caribou.body.velocity.x = 0;
            }
            else if (caribouComingFrom === Utilities.Right) {
                caribou.body.velocity.x = -(Utilities.Speed3);
                caribou.body.velocity.y = 0;
            }
            else if (caribouComingFrom === Utilities.Left) {
                caribou.body.velocity.x = (Utilities.Speed3);
                caribou.body.velocity.y = 0;
            }


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
                //console.log("Took nw exit!");
                levelWin = true;
                this.die();
            }
        }

        else if (this.pacman.x == neExit.x + 12 && this.pacman.y == neExit.y + 36) {
            if (neExitState == ExitState.OPEN) {
                //console.log("Took ne exit!");
                levelWin = true;
                this.die();
            }
        }

        else if (this.pacman.x == swExit.x + 12 && this.pacman.y == swExit.y + 36) {
            if (swExitState == ExitState.OPEN) {
                //console.log("Took sw exit!");
                levelWin = true;
                this.die();
            }
        }

        else if (this.pacman.x == seExit.x + 12 && this.pacman.y == seExit.y + 36) {
            if (seExitState == ExitState.OPEN) {
                //console.log("Took se exit!");
                levelWin = true;
                this.die();
            }
        }
    },

    powerPellet: function () {
        if (this.pacman.x == 8 * 24 + 12 && this.pacman.y == 4 * 24 + 12) {
            console.log("topLeftAlarm")
            powerCounter = 1000
            if (topLeftAlarm === true) {
                chaserReturn = true;
                racerReturn = true;
                tracerReturn = true;
                caribouReturn = true;
            }
            topLeftAlarm = false;
            topLeftAlarmUsed.revive();
            
        }

        if (this.pacman.x == 29 * 24 + 12 && this.pacman.y == 4 * 24 + 12) {
            console.log("topRightAlarm")
            powerCounter = 1000
            if (topRightAlarm === true) {
                chaserReturn = true;
                racerReturn = true;
                tracerReturn = true;
                caribouReturn = true;
            }
            topRightAlarm = false;
            topRightAlarmUsed.revive();
        }

        if (this.pacman.x == 10 * 24 + 12 && this.pacman.y == 28 * 24 + 12) {
            console.log("bottomLeftAlarm")
            powerCounter = 1000
            if (bottomLeftAlarm === true) {
                chaserReturn = true;
                racerReturn = true;
                tracerReturn = true;
                caribouReturn = true;
            }
            bottomLeftAlarm = false;
            bottomLeftAlarmUsed.revive();
        }

        if (this.pacman.x == 28 * 24 + 12 && this.pacman.y == 28 * 24 + 12) {
            console.log("bottomRightAlarm")
            powerCounter = 1000
            if (bottomRightAlarm === true) {
                chaserReturn = true;
                racerReturn = true;
                tracerReturn = true;
                caribouReturn = true;
            }
            bottomRightAlarm = false;
            bottomRightAlarmUsed.revive();
        }

    },

    alarmFX: function () {

        if (chaserReturn === true || racerReturn === true || tracerReturn === true || caribouReturn === true) {
            redTint.revive();
            fireSound.play();

        }
        else {
            redTint.kill();
        }

    },
    
    pause: function()  {        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);    },
    resume: function () {
        sprintButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        sprintButton.onDown.add(this.sprint, this);
    },

    update: function () {

        this.physics.arcade.collide(this.pacman, mapLayer);
        this.game.physics.arcade.collide(this.guard, mapLayer);
        this.game.physics.arcade.collide(chaser, mapLayer);
        this.game.physics.arcade.collide(racer, mapLayer);
        this.game.physics.arcade.collide(tracer, mapLayer);
        this.game.physics.arcade.collide(caribou, mapLayer);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);

        this.checkStairsCollision();

        
        this.powerPellet();
        
        
        powerCounter--;
       


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

        if (sprintCounter < 300 && sprintCounter > 0) {
            this.speed = 120
            sprintCounter--;
        }
        else if(sprintCounter > 0){
            this.pause();
            sprintCounter--;
        }
        else {
            this.resume();
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

        if (counter3 === 0) {
            this.tracerAI();
        }
        else {
            counter3--;
        }

        if (counter4 === 0) {
            this.caribouAI();
        }
        else {
            counter4--;
        }

        if (currentDots < requiredDots)
        {

        }
        else {
            map.setCollision(32, false, mapLayer)
        }
        
        this.chaserSpeedUp();
        this.racerSpeedUp();
        this.tracerSpeedUp();
        this.caribouSpeedUp();

        this.alarmFX();

        console.log(sprintCounter);

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
