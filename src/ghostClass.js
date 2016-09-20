

var GhostMode = { Scared: 0, Chase: 1, Scatter: 2, Killed: 3, BackToNormal: 4 };

function Ghost(game, x, y, image, targetX, targetY){
    Phaser.Sprite.call(this, game, Utilities.TILE_SIZE * x, Utilities.TILE_SIZE * y, image);
	
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.bounce.y = 0;
    this.body.bounce.x = 0;
	
    this.marker = new Phaser.Point(x,y);
    this.target = new Phaser.Point(0,0);
	
    this.scatterTarget = new Phaser.Point(targetX, targetY);
	
    this.directions = [null, null, null, null]
    this.distance = [null, null, null, null];
	
    this.speedModifiers = [0.6,0.95,0.95,0.95,0.95];
	
    this.mode = GhostMode.Scatter;
    this.modeBeforeScared = GhostMode.Scatter;
	
    this.startingTile = new Phaser.Point(x,y);
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;

Ghost.prototype.respawnTarget = new Phaser.Point(13,11);

Ghost.prototype.move = function(direction){
    if(direction === Utilities.Up)
    {
        this.body.velocity.y = -(Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Down;
		
    }
    else if(direction === Utilities.Down)
    {
        this.body.velocity.y = (Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Up;
    }
    else if(direction === Utilities.Left)
    {
        this.body.velocity.x = -(Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Right;
    }
    else if(direction === Utilities.Right)
    {
        this.body.velocity.x = (Utilities.Speed * this.speedModifiers[this.mode]);
        this.comingFrom = Utilities.Left;
    }
};

Ghost.prototype.PositionChanged = function(){

    var tmpX, tmpY;
	
    if(this.body.velocity.x < 0)
        tmpX = Utilities.pixelsToTiles(this.x + this.width);
    else
        tmpX = Utilities.pixelsToTiles(this.x);
		
    if(this.body.velocity.y < 0)
        tmpY = Utilities.pixelsToTiles(this.y + this.height);
    else
        tmpY = Utilities.pixelsToTiles(this.y);
		
    if(tmpX != this.marker.x || tmpY != this.marker.y)
    {
        this.marker.x = tmpX;
        this.marker.y = tmpY;
        return true;
    }
    else
        return false;

};

Ghost.prototype.makeDecision = function(player, additionalPoint, map)
{
    this.updateTarget(player, additionalPoint);
    this.decideDirection(map);
}

Ghost.prototype.updateTarget = function(player, additionalPoint)
{
    if(this.mode === GhostMode.Chase){
        this.ChasingTarget(player, additionalPoint);
    }
    else if(this.mode === GhostMode.Scatter){
        this.target.x = this.scatterTarget.x;
        this.target.y = this.scatterTarget.y;
    }
    else if(this.mode === GhostMode.Scared){
        this.target.x = Math.random() * (Utilities.mapWidth - 1) + 1;
        this.target.y = Math.random() * (Utilities.mapHeight - 1) + 1;
    }
    else{ // if it's not chasing, or scattering nor scared - it's killed
        this.target.x = this.respawnTarget.x;
        this.target.y = this.respawnTarget.y;
    }
};

Ghost.prototype.ChasingTarget = function(player, additionalPoint)
{
    console.log("Ghost function");
    this.target.x = Utilities.pixelsToTiles(player.x);
    this.target.y = Utilities.pixelsToTiles(player.y);
}

Ghost.prototype.decideDirection = function(map){

    this.updateDirections(map);
	
    this.resetPositionToPoint(this.marker);
	
    var length = this.directions.length;
	
    for(var i= 0; i < length; i++)
    {	
        if(this.directions[i].index === 1 && i !== this.comingFrom)
            this.distance[i] = Phaser.Point.distance(this.target,this.directions[i]);
        else
            this.distance[i] = 2000;
    }
	
    var smallest = 0;
    for(i=1; i < length; i++)
    {
        if(this.distance[smallest] > this.distance[i])
            smallest = i;
    }
	
    if(smallest != this.comingFrom && this.directions[smallest].index === 1)
        this.move(smallest);
};

Ghost.prototype.resetPositionToPoint = function(point){
    this.x = Utilities.tileToPixels(point.x);
    this.y = Utilities.tileToPixels(point.y);
    this.body.reset(Utilities.tileToPixels(point.x),Utilities.tileToPixels(point.x));
}

Ghost.prototype.resetPosition = function(){
    this.resetPositionToPoint(this.startingTile);
};

Ghost.prototype.updateDirections = function(map){

    this.directions[Utilities.Up] = map.getTileAbove(map.getLayer(), this.marker.x, this.marker.y);
    this.directions[Utilities.Left] = map.getTileLeft(map.getLayer(), this.marker.x, this.marker.y);
    this.directions[Utilities.Down] = map.getTileBelow(map.getLayer(), this.marker.x, this.marker.y);
    this.directions[Utilities.Right] = map.getTileRight(map.getLayer(), this.marker.x, this.marker.y);

};

Ghost.prototype.collide = function(){

    var length = this.directions.length;
	
    for( var i = Utilities.Up; i < length;)
    {
        if(i !== this.comingFrom && this.directions[i].index === 1)
        {			
            this.move(i);
            break;
        }
        else
        {
            ++i;
        }
    }

};

Ghost.prototype.changeMode = function(newMode, texture){
	
    if(newMode === GhostMode.Scared)
        this.modeBeforeScared = this.mode;
	
    if(newMode === GhostMode.BackToNormal)
        this.mode = this.modeBeforeScared;
    else
        this.mode = newMode;
	
	
    if(texture)
        this.loadTexture(texture);
		
    this.updateVelocity();
};


Ghost.prototype.reverse = function(){
    this.body.velocity.x *= -1;
    this.body.velocity.y *= -1;
	
    if(this.comingFrom === Utilities.Up)
        this.comingFrom = Utilities.Down;
    else if(this.comingFrom === Utilities.Down)
        this.comingFrom = Utilities.Up;
    else if(this.comingFrom === Utilities.Left)
        this.comingFrom = Utilities.Right;
    else if(this.comingFrom === Utilities.Right)
        this.comingFrom = Utilities.Left;
};

Ghost.prototype.utilizeSpecialPoint = function(map){
    if(this.mode === GhostMode.Killed && Phaser.Point.equals(this.marker,this.respawnTarget))
    {
        this.respawn();
    }
    else if(this.marker.y === 11 && (this.marker.x === 12))
    {		
        this.resetPositionToPoint(this.marker);
		
        if(this.mode === GhostMode.Scared)
            this.makeDecision(null,null,map);
        else
        {
            if(this.comingFrom === Utilities.Left)
                this.move(Utilities.Right);
            else
                this.move(Utilities.Left);
        }
    }
};

