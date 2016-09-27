var Utilities = {
    TILE_SIZE: 24,
    mapWidth: 32 * 24,
    mapHeight: 34 * 24,
    NONE: -1,
    Up: 0,
    Left: 1,
    Down: 2,
    Right: 3,
    Speed: 160,
    arrayContains: function (array, object) {
        var i = array.length;
        while (i--) {
            if (Phaser.Point.equals(object, array[i]))
                return true;
        }
        return false;
    },
    pixelsToTiles: function (pixelValue) {
        return Phaser.Math.snapToFloor(Math.floor(pixelValue), this.TILE_SIZE) / this.TILE_SIZE;
    },
    tileToPixels: function (tileValue) {
        return tileValue * this.TILE_SIZE;
    }
};