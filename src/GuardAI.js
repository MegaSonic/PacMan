function Guard(game, x, y, image, targetX, targetY) {
    Ghost.call(this, game, x, y, image, targetX, targetY);
};

Guard.prototype = Object.create(Ghost.prototype);
Guard.prototype.constructor = Guard;
