function Ghost(game, x, y, image, targetX, targetY){
    Phaser.Sprite.call(this, game, 24 * x, 24 * y, image);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.bounce.y = 0;
    this.body.bounce.x = 0;

    this.ghostmarker = new Phaser.Point(x, y);

}

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;

Ghost.prototype.move = function (direction) {
    if (direction === Utilities.Up) {
        this.body.velocity.y = -(Utilitiess.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Down;

    }
    else if (direction === Utilities.Down) {
        this.body.velocity.y = (Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Up;
    }
    else if (direction === Utilities.Left) {
        this.body.velocity.x = -(Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Right;
    }
    else if (direction === Utilities.Right) {
        this.body.velocity.x = (Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Left;
    }
};

Ghost.prototype.updateDirections = function (map) {

    this.guard.directions[Utilities.Up] =
           this.map.getTileAbove(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);
    this.guard.directions[Utilities.Left] =
       this.map.getTileLeft(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);
    this.guard.directions[Utilities.Down] =
       this.map.getTileBelow(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);
    this.guard.directions[Utils.Right] =
       this.map.getTileRight(this.map.getLayer(), this.ghostmarker.x, this.ghostmarker.y);

};
