
var game = new Phaser.Game(900, 800, Phaser.AUTO);

var Pacman = function (game) {

    this.map = null;
    this.layer = null;
    this.pacman = null;
    this.ghost1 = null;
    this.guard = null;
    this.comingFrom = Utilities.Right;


    this.safetile = 3;
    this.gridsize = 24;

    this.speed = 175;
    this.threshold = 6;
    this.lives = 3;

	this.justTeleported = false;
	
    this.marker = new Phaser.Point();
    this.ghostmarker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [null, null, null, null, null];
    this.guarddirections = [null, null, null, null, null];
    this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;

};

var score = 0;
var text;
var textGroup;
var livesText;
var dieButton;

var enemies;

var pinky;

Pacman.prototype = {

    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
		
    },



    preload: function () {

        /*
        game.load.image('tiles', '../assets/tile_set.png');
        game.load.tilemap('map', '../assets/maze.json', null, Phaser.Tilemap.TILED_JSON);
        
        text.anchor.setTo(0.5, 0.5);
        */

        text = game.add.text(0, 0, score, { font: "24px Arial", fill: "#ff0044", align: "center" });
        livesText = game.add.text(game.world.width - 100, 0, this.lives, { font: "24px Arial", fill: "#ff0044", align: "center" });

        this.load.image('dot', 'assets/dot.png');

        /*

        this.load.image('tiles', 'assets/pacman-tiles.png');
        this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
        this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);

        */

        this.load.tilemap('map', 'assets/pac_maze.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tile_set.png');
        this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
        this.load.image('ghost', 'assets/ghost.png');
        game.load.image('pinky', 'assets/pinky.png');
        // this.load.tilemap('map', 'assets/pac_maze.json', null, Phaser.Tilemap.TILED_JSON);


    },



    create: function () {

        this.stage.backgroundColor = '#787878';
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('pacman', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        // this.layer.resizeWorld();

        this.dots = this.add.physicsGroup();
        this.map.createFromTiles(3, this.safetile, 'dot', this.layer, this.dots);

        //  The dots will need to be offset by 12px to put them back in the middle of the grid
        this.dots.setAll('x', 12, false, false, 1);
        this.dots.setAll('y', 12, false, false, 1);
		
		this.stairs = this.add.physicsGroup();
		this.map.createFromTiles(6, 6, 'dot', this.layer, this.stairs);

        this.map.setCollisionByExclusion([this.safetile, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15], true, this.layer);
        this.pacman = this.add.sprite((3 * 24) + 12, (1 * 24) + 12, 'pacman', 0);
        this.pacman.anchor.set(0.5);
        this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true);

        this.physics.arcade.enable(this.pacman);
        this.pacman.body.setSize(24, 24, 0, 0);
        this.cursors = this.input.keyboard.createCursorKeys();
        dieButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // dieButton.onDown.add(die, this);

        this.pacman.play('munch');
        this.move(Phaser.RIGHT);

        this.guard = this.add.sprite((this.gridsize * 3) + 12, (this.gridsize * 1) + 12, 'ghost',0);
        this.guard.anchor.set(0.5);
       
        this.game.physics.enable(this.guard, Phaser.Physics.ARCADE);
        this.guard.body.setSize(24, 24, 0, 0);
        this.guard.body.velocity.x = this.speed;

		textGroup = game.add.group();
		textGroup.add(text);

		enemies = this.add.group();

		pinky = new Guard(game, 14, 7, 'pinky', 3, 1);

		enemies.forEach(function (ghost) {
		    ghost.move(Utils.Left);
		}, this);
    },

    checkKeys: function () {
        if (dieButton.isDown) {
            this.die();
        }

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
            if (this.directions[turnTo].index !== 8) {
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
        }
        else if (direction === Phaser.UP) {
            this.pacman.angle = 270;
        }
        else if (direction === Phaser.DOWN) {
            this.pacman.angle = 90;
        }
        this.current = direction;
    },

    

    ghostmove: function (direction) {
        if (direction === Utilities.Up) {
            this.guard.body.velocity.y = -(Utilities.Speed);
            this.comingFrom = Utilities.Down;

        }
        else if (direction === Utilities.Down) {
            this.guard.body.velocity.y = (Utilities.Speed);
            this.comingFrom = Utilities.Up;
        }
        else if (direction === Utilities.Left) {
            this.guard.body.velocity.x = -(Utilities.Speed);
            this.comingFrom = Utilities.Right;
        }
        else if (direction === Utilities.Right) {
            this.guard.body.velocity.x = (Utilities.Speed);
            this.comingFrom = Utilities.Left;
        }
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
        livesText.text = this.lives;
        if (this.lives <= 0) {
            textGroup.add.text(game.world.centerX, game.world.centerY - 200, "Game Over", { font: "48px Arial", fill: "#ffffff", align: "center" });
            this.pacman.kill();
        }
        else {
            this.dots.callAll('revive');
            this.pacman.x = (3 * this.gridsize) + this.gridsize / 2;
            this.pacman.y = (1 * this.gridsize) + this.gridsize / 2;
            this.move(Phaser.RIGHT);
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

    ghostAI: function () {



    },

    update: function () {

        enemies.forEach(function (ghost) {
            this.game.physics.arcade.collide(ghost, this.layer, ghostCollide);
        }, this);

        this.physics.arcade.collide(this.pacman, this.layer);
        this.game.physics.arcade.collide(this.guard, this.layer);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
		
		if (this.physics.arcade.overlap(this.pacman, this.stairs)) {
			this.teleport();
		}
		else {
			this.justTeleported = false;
		}


        this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
        this.checkKeys();
        if (this.turning !== Phaser.NONE) {
            this.turn();
        }

        this.ghostmarker.x = this.math.snapToFloor(Math.floor(this.guard.x), this.gridsize) / this.gridsize;
        this.ghostmarker.y = this.math.snapToFloor(Math.floor(this.guard.y), this.gridsize) / this.gridsize;

        this.guarddirections[Utilities.Up] = this.map.getTileAbove(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);
        this.guarddirections[Utilities.Left] = this.map.getTileLeft(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);
        this.guarddirections[Utilities.Down] = this.map.getTileBelow(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);
        this.guarddirections[Utilities.Right] = this.map.getTileRight(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);

        for (var i = Utilities.Up; i < 4;) {
            if (i !== this.comingFrom && this.guarddirections[i].index === this.safetile) {
                this.ghostmove(i);
                break;
            }
            else {
                ++i;
            }
        }

    }
}

function ghostCollide(ghost, tile) {
    ghost.updateDirections(map);
    ghost.collide();
}



game.state.add('Game', Pacman, true);
