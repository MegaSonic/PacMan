function Guard(game, x, y, image, targetX, targetY) {
    Ghost.call(this, game, x, y, image, targetX, targetY);
};

Guard.prototype = Object.create(Ghost.prototype);
Guard.prototype.constructor = Guard;

Guard.prototype.ChasingTarget = function (player, additionalPoint) {
    this.target.x = Utils.pixelsToTiles(player.x);
    this.target.y = Utils.pixelsToTiles(player.y);
};
