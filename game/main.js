
window.onload = function () {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(744, 816, Phaser.AUTO);

    var Underground = function (game) {

        this.map = null;
        this.layer = null;
        
    };

    Underground.prototype = {

        init: function(){
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

            this.physics.startSystem(Phaser.Physics.ARCADE);

        },


        preload: function () {

            this.load.tilemap('maze', 'assets/maze.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'assets/tile_set.png');


        },

        create: function () {

            this.map = this.add.tilemap('maze');
            this.map.addTilesetImage('tile_set', 'tiles');

            this.layer = this.map.createLayer('Underground');
            this.layer.resizeWorld();
        },

        update: function(){

        }
    }

};

game.state.add('Game', Underground, true);