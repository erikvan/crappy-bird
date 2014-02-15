$(document).ready(function(){
    var width = $(window).width();
    var height = $(window).height();

    var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    window.scrollTo(0,1);

    function preload() {

        game.load.image('sky', 'images/sky.png');
        game.load.image('poop', 'images/poop.png');
        game.load.spritesheet('bird', 'images/crappy-bird-sprite.png', 61, 41);
        game.load.spritesheet('person', 'images/dude.png', 32, 48);
    }

    var player;
    var cursors;
    var fire;
    var poops;
    var targets;
    var pooptimer = 0;
    var worldWidth = 3496;

    var scoresprite;
    var score = 0;
    var scoretext = "Score: " + score;
    var scorelabel;

    function create() {

        game.stage.backgroundColor = "#87abf5";
        //  A simple background for our game
        //game.add.sprite(0, 0, 'sky');

        game.world.setBounds(0,0, worldWidth, height);

        // The player and its settings
        player = game.add.sprite(0, 100,  'bird');

        //Following the player
        game.camera.follow(player);


        //Fly animation.
        player.animations.add('fly', [0, 1, 2, 3], 5, true);

        //Poops
        poops = game.add.group();
        poops.createMultiple(100, 'poop');


        //People sprites
        targets = game.add.group();
        targets.createMultiple(Math.random() * 50, 'person');
        targets.forEach(setupTarget);


        //Score
        scoresprite = game.add.sprite(0,0);
        scoresprite.fixedToCamera = true;

        scorelabel = game.add.text(0, 0, scoretext, {});
        scoresprite.addChild(scorelabel);
        scoresprite.cameraOffset.x = 10;
        scoresprite.cameraOffset.y = 10;

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function update() {
        //  Reset the players velocity (movement)
        player.body.velocity.x = 100;
        player.animations.play('fly');

        game.physics.collide(targets);
        game.physics.overlap(poops, targets, poopCollisionHandler, null, this);
        targets.forEach(animateTarget);

        if (game.input.pointer1.isDown || fire.isDown)
        {
            launchPoop();
        }

        //Player off screen event
        if(player.inWorld === false){
            nextLevel();
        }

        //update score
        scoretext = "Score: " + score;
        scorelabel.content = scoretext;


    }


    /*******************
     * CUSTOM FUNCTIONS
     *******************/
    //Launching the Poop
    function launchPoop(){
        //if the poop time out has expired launch a poop.
        if(game.time.now > pooptimer){
            var poop = poops.getFirstExists(false);
            if (poop)
            {
                poop.reset(player.x + 12, player.y + 33);
                poop.body.gravity.y = 10;
                pooptimer = game.time.now + 250;
            }
        }

    }




    //TO DO: Add next level logic.
    function nextLevel(){

    }

    //Setting up the targets
    function setupTarget(target){
        target.body.collideWorldBounds = true;
        target.animations.add('left', [0, 1, 2, 3], 10, true);
        target.animations.add('right', [5, 6, 7, 8], 10, true);

        var x = Math.random() * worldWidth;
        target.reset(x, game.world.height);
        target.body.velocity.x = game.rnd.integerInRange(-100, 100);
        target.body.bounce.x = 1;

    }

    function animateTarget(target){
        if(target.body.velocity.x > 0){
            target.animations.play('right');
        } else {
            target.animations.play('left');
        }
    }

    function poopCollisionHandler(poop, target){
        poop.kill();
        target.kill();
        score += 120;
    }
});


