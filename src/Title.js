var titleText;
var startText;

var inputButton;
var leftButton;
var rightButton;

var titleImage;

var titleState = {
	
	init: function () {
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        //Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        Phaser.Canvas.setSmoothingEnabled(this.game.canvas, false);
        this.physics.startSystem(Phaser.Physics.ARCADE);


    },

	preload: function () {

		game.load.spritesheet('titleImage', 'assets/Title_screen_sprites_100ms.png', 928, 816);
		game.load.spritesheet('gameOverImage', 'assets/Gameover_sprites_30ms.png', 928, 816);

		game.load.audio('fire', 'assets/fire.WAV');

		//titleText = game.add.text(0, 0, "Underground", { font: "36px Arial", fill: "#ff0044", align: "center" });
        //startText = game.add.text(0, 500, "Start", { font: "24px Arial", fill: "#ff0044", align: "center" });
	},

	create: function () {
		titleImage = game.add.sprite(0, 0, 'titleImage', 0);
		titleImage.animations.add('play', [0, 1, 2, 3], 10, true);
		game.stage.backgroundColor = '#000000';
		inputButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		leftButton = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightButton = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        inputButton.onDown.add(this.startGame, this);
        leftButton.onDown.add(this.startGameMale, this);
        rightButton.onDown.add(this.startGameFemale, this);
        titleImage.play('play');
	},

	startGame: function() {
		game.state.start('Game');
	},

	startGameMale: function() {
		playerGender = PlayerState.MALE;
		game.state.start('Game');
		
	},

	startGameFemale: function() {
		playerGender = PlayerState.FEMALE;
		game.state.start('Game');
		
	},

	update: function () {

	}
}