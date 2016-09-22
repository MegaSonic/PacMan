var exitTimer = 0;
var exitTime = 8;
var nwExit = null;
var neExit = null;
var swExit = null;
var seExit = null;

var ExitState = {OPEN: 0, CLOSED: 1};


var nwExitState = ExitState.CLOSED;
var neExitState = ExitState.CLOSED;
var swExitState = ExitState.CLOSED;
var seExitState = ExitState.CLOSED;



var openProbability = 40;




function StartExit() {

	nwExit = game.add.sprite((1 * Utilities.TILE_SIZE), (3 * Utilities.TILE_SIZE), 'exitLights', 0);
	neExit = game.add.sprite((30 * Utilities.TILE_SIZE), (3 * Utilities.TILE_SIZE), 'exitLights', 0);
	swExit = game.add.sprite((1 * Utilities.TILE_SIZE), (27 * Utilities.TILE_SIZE), 'exitLights', 0);
	seExit = game.add.sprite((30 * Utilities.TILE_SIZE), (27 * Utilities.TILE_SIZE), 'exitLights', 0);

	console.log("Added sprites?");

	console.log(Utilities.TILE_SIZE);
	nwExit.animations.add('close', [0], 20, true);
	nwExit.animations.add('open', [1], 20, true);


	neExit.animations.add('close', [0], 20, true);
	neExit.animations.add('open', [1], 20, true);

	swExit.animations.add('close', [0], 20, true);
	swExit.animations.add('open', [1], 20, true);

	seExit.animations.add('close', [0], 20, true);
	seExit.animations.add('open', [1], 20, true);

	nwExit.play('close');
	swExit.play('close');
	seExit.play('close');
	neExit.play('close');

	console.log("added animations?");

	exitTimer = exitTime;
}

function CheckAllDoors() {
	if (game.rnd.integerInRange(1, 100) < openProbability) {
		nwExitState = ExitState.OPEN;
		nwExit.play('open');
	}
	else {
		nwExitState = ExitState.CLOSED;
		nwExit.play('close');
	}

	if (game.rnd.integerInRange(1, 100) < openProbability) {
		swExitState = ExitState.OPEN;
		swExit.play('open');
	}
	else {
		swExitState = ExitState.CLOSED;
		swExit.play('close');
	}

	if (game.rnd.integerInRange(1, 100) < openProbability) {
		neExitState = ExitState.OPEN;
		neExit.play('open');
	}
	else {
		neExitState = ExitState.CLOSED;
		neExit.play('close');
	}

	if (game.rnd.integerInRange(1, 100) < openProbability) {
		seExitState = ExitState.OPEN;
		seExit.play('open');
	}
	else {
		seExitState = ExitState.CLOSED;
		seExit.play('close');
	}

	exitTimer = exitTime;
}

function UpdateExit() {
	if (exitTimer > 0) {
		exitTimer -= game.time.physicsElapsed;
		// console.log(exitTimer);
	}
	else {
		CheckAllDoors();
	}
	
}