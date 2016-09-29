var exitTimer = 0;
var exitTime = 8;
var nwExit = null;
var neExit = null;
var swExit = null;
var seExit = null;

var ExitState = {OPEN: 0, CLOSED: 1, GATED: 2};

var nwTrain = null;
var neTrain = null;
var swTrain = null;
var seTrain = null;


var nwExitState = ExitState.CLOSED;
var neExitState = ExitState.CLOSED;
var swExitState = ExitState.CLOSED;
var seExitState = ExitState.CLOSED;



var openProbability = 40;




function StartExit() {

	nwExit = game.add.sprite(((1 + 3) * Utilities.TILE_SIZE), (3 * Utilities.TILE_SIZE), 'exitLights', 0);
	neExit = game.add.sprite(((30 + 3) * Utilities.TILE_SIZE), (3 * Utilities.TILE_SIZE), 'exitLights', 0);
	swExit = game.add.sprite(((1 + 3) * Utilities.TILE_SIZE), (27 * Utilities.TILE_SIZE), 'exitLights', 0);
	seExit = game.add.sprite(((30 + 3) * Utilities.TILE_SIZE), (27 * Utilities.TILE_SIZE), 'exitLights', 0);

	nwTrain = game.add.sprite(leftRails.x, leftRails.y, 'train', 0);
	swTrain = game.add.sprite(leftRails.x, leftRails.y + 575, 'train', 0);
	neTrain = game.add.sprite(rightRails.x, rightRails.y, 'train', 0);
	seTrain = game.add.sprite(rightRails.x, rightRails.y + 575, 'train', 0);



	nwTrain.kill();
	swTrain.kill();
	neTrain.kill();
	seTrain.kill();

	console.log("Added sprites?");

	console.log(Utilities.TILE_SIZE);
	nwExit.animations.add('gate', [2], 10, true);
	nwExit.animations.add('close', [0], 20, true);
	nwExit.animations.add('open', [1], 20, true);
	

	neExit.animations.add('gate', [2], 10, true);
	neExit.animations.add('close', [0], 20, true);
	neExit.animations.add('open', [1], 20, true);
	

	swExit.animations.add('gate', [2], 10, true);
	swExit.animations.add('close', [0], 20, true);
	swExit.animations.add('open', [1], 20, true);

	seExit.animations.add('gate', [2], 10, true);
	seExit.animations.add('close', [0], 20, true);
	seExit.animations.add('open', [1], 20, true);

	nwExit.play('close');
	swExit.play('close');
	seExit.play('close');
	neExit.play('close');

	console.log("added animations?");

	exitTimer = exitTime;

	nwExit.kill();
	swExit.kill();
	neExit.kill();
	seExit.kill();
}

function CheckAllDoors() {
	// If the gates pass the check and are open
	if (game.rnd.integerInRange(1, 100) < openProbability) {
		nwTrain.revive();
		// If the player doesn't have enough money
		if (currentDots < requiredDots) {
			console.log('playing nw gated!');
			nwExitState = ExitState.GATED;
			nwExit.play('gate');
		}
		// If the player does have the money
		else {
			nwExitState = ExitState.OPEN;
			nwExit.play('open');
		}
	}
	// If the gate isn't open
	else {
		nwExitState = ExitState.CLOSED;
		nwExit.play('close');
		nwTrain.kill();
	}

	if (game.rnd.integerInRange(1, 100) < openProbability) {
		swTrain.revive();
		if (currentDots < requiredDots) {
			console.log('playing sw gated!');
			swExit.animations.stop();
			swExitState = ExitState.GATED;
			swExit.play('gate');
		}
		else {
			swExit.animations.stop();
			swExitState = ExitState.OPEN;
			swExit.play('open');
		}
	}
	else {
		swExit.animations.stop();
		swExitState = ExitState.CLOSED;
		swExit.play('close');
		swTrain.kill();
	}

	if (game.rnd.integerInRange(1, 100) < openProbability) {
		neTrain.revive();
		if (currentDots < requiredDots) {
			console.log('playing ne gated!');
			neExit.animations.stop();
			neExitState = ExitState.GATED;
			neExit.play('gate');
		}
		else {
			neExit.animations.stop();
			neExitState = ExitState.OPEN;
			neExit.play('open');
		}
	}
	else {
		neExit.animations.stop();
		neExitState = ExitState.CLOSED;
		neExit.play('close');
		neTrain.kill();
	}

	if (game.rnd.integerInRange(1, 100) < openProbability) {
		seTrain.revive();
		if (currentDots < requiredDots) {
			seExit.animations.stop();
			console.log('playing se gated!');
			seExitState = ExitState.GATED;
			seExit.play('gate');
			
		}
		else {
			seExit.animations.stop();
			seExitState = ExitState.OPEN;
			seExit.play('open');
		}
	}
	else {
		seExit.animations.stop();
		seExitState = ExitState.CLOSED;
		seExit.play('close');
		seTrain.kill();
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

	if (seExitState == ExitState.GATED && currentDots >= requiredDots) {
		seExitState = ExitState.OPEN;
		seExit.play('open');
	}

	if (neExitState == ExitState.GATED && currentDots >= requiredDots) {
		neExitState = ExitState.OPEN;
		neExit.play('open');
	}

	if (swExitState == ExitState.GATED && currentDots >= requiredDots) {
		swExitState = ExitState.OPEN;
		swExit.play('open');
	}

	if (nwExitState == ExitState.GATED && currentDots >= requiredDots) {
		nwExitState = ExitState.OPEN;
		nwExit.play('open');
	}
	
}