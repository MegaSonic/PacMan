var gameOverText;

var gameOverButton;

var gameOverState = {
	
	preload: function () {
		gameOverText = game.add.text(500, 500, "Game Over", { font: "36px Arial", fill: "#ff0044", align: "center" });
	},

	create: function () {
		game.stage.backgroundColor = '#000000';
		gameOverButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        gameOverButton.onDown.add(this.resetGame, this);
	},

	resetGame: function() {
		game.state.start('Title');
	},

	update: function () {

	}
}