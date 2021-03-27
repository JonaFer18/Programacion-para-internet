var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 630,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var platforms;
var limit;
var player;
var cursors;
var stars;
var velo=1;
var score = 0;
var scoreText;
function preload ()
{
    this.load.image("fondo", "assets/clouds.png");
    this.load.image("limite", "assets/limit.png");
    this.load.spritesheet("Bombexplota", "assets/bomb (2).png", { frameWidth: 46, frameHeight: 55 });
    this.load.spritesheet("personaje", "assets/adventurer-Sheet.png", { frameWidth: 50, frameHeight: 37 });
    this.load.spritesheet("ground", "assets/bomb (1).png", { frameWidth: 53, frameHeight: 40 });
}

function create ()
{
    this.add.image(200, 315,"fondo");
    platforms = this.physics.add.staticGroup();
    cursors = this.input.keyboard.createCursorKeys();
    platforms.create(50, 600, "ground").setScale().refreshBody();
    limit = this.physics.add.staticGroup();
    limit.create(200, 630, "limite").setScale().refreshBody();
    scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#FF0000" });
    player= this.physics.add.sprite(1,300,"personaje");
    player.setCollideWorldBounds(true);
    player.body.bounce.set(0.3,0.3);
    this.physics.add.collider(player, platforms, pisada, null, this);
    this.physics.add.collider(player, limit, gameOver, null, this);
    this.anims.create({
        key: 'salto',
        frames: this.anims.generateFrameNumbers("personaje", { start: 14, end: 24 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'camina',
        frames: this.anims.generateFrameNumbers("personaje", { start: 8, end: 13 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'explocion',
        frames: this.anims.generateFrameNumbers("Bombexplota", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
}
function gameOver(player, limit){
    player.anims.play("explocion");
    scoreText = this.add.text(100, 300, "Game Over ",{ fontSize: "40px", fill: "#FF0000" });
    this.physics.pause();
}
function pisada(player,plataform){
    player.setVelocityY(-350);
    plataform.anims.play("explocion");
    genera();
    player.anims.play("salto");
    velo+=3;
    plataform.disableBody(true, true);
}
function genera(){
    var x, y;
    var masOmenosy= Math.random() < 0.2;
    x=Math.floor(Math.random() * 380-1) + 1;
    if(player.y>315){
         y=Math.floor(Math.random() * 100-99) + 99;
        if((player.y+y )<630 && (player.y-y )>50){
            if(masOmenosy)
            y=player.y+y;
            else
            y=player.y-y;   
        }else if((player.y+y )<630)
            y=player.y+y;
        else
        y=player.y-y;  
    }else
          y=Math.floor(Math.random() * 620-400) + 400;
    score +=5;
    scoreText.setText("Score: "+score);
    platforms.create(x, y, "ground");
    
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160-velo);
        player.anims.play("camina", true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160+velo);
       player.anims.play("camina", true);
    }

}
