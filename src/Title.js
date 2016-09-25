var titleText;
var startText;

var inputButton;

var titleState = {
	
	preload: function () {
		titleText = game.add.text(0, 0, "Underground", { font: "36px Arial", fill: "#ff0044", align: "center" });
        startText = game.add.text(0, 500, "Start", { font: "24px Arial", fill: "#ff0044", align: "center" });
	},

	create: function () {
		game.stage.backgroundColor = '#787878';
		inputButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        inputButton.onDown.add(this.startGame, this);
	},

	startGame: function() {
		game.state.start('Game');
	},

	update: function () {

	}
}