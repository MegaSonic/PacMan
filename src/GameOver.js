var gameOverText;

var gameOverButton;
var gameOverImage;


var gameOverState = {
	
	preload: function () {

		
		// gameOverText = game.add.text(500, 500, "Game Over", { font: "36px Arial", fill: "#ff0044", align: "center" });
	},

	create: function () {
		game.stage.backgroundColor = '#000000';
		gameOverImage = game.add.sprite(0, 0, 'gameOverImage', 0);
		gameOverImage.animations.add('play', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 30, true);

		gameOverButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        gameOverButton.onDown.add(this.resetGame, this);

        gameOverImage.play('play');
	},

	resetGame: function() {
		game.state.start('Title');
	},

	update: function () {

	}
}