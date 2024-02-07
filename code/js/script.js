document.addEventListener('DOMContentLoaded', Init);

var canvas = /** @type {HTML CanvasElement} */(null);
var  ctx = /** @type {CanvasRenderingContext2D} */(null);

var lastFrameTime = Date.now();
var targetFPS = 60;
var targetDelta = 1000 / targetFPS;
var fps = 0;

var count = 0;
// Game variables
var playerAsset;

var enemyAsset;
var enemy1Asset;
var enemy2Asset;

var layout = null;

var player = null;

var enemies = null;

var shields = [];

var keyCodes = {
    D: false,
    A: false,
    space: false
};

let requestId;
let paused = false;

var hiScore = localStorage.getItem("newhiScore");

function Init()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    // Input Setup
    SetupInput();

    playerAsset = new Image();
    playerAsset.src = "../../assets/sprites/Player_Sprite.png";
    enemyAsset = new Image();
    enemyAsset.src = "../../assets/sprites/Enemy_Sprite.png";
    enemy1Asset = new Image();
    enemy1Asset.src = "../../assets/sprites/Enemy1_Sprite.png";
    enemy2Asset =  new Image();
    enemy2Asset.src = "../../assets/sprites/Enemy2_Sprite.png";

    playerAsset.onload = () => {
        count ++;
    }
    enemyAsset.onload = () => {
        count ++;           
    }
    enemy1Asset.onload = () => {
        count ++;
    } 
    enemy2Asset.onload = () => {
        count++;
    }

    if(count == 4)
    {
        Start();
        Loop();
    }
}

function Start()
{
    // Initialize the background
    layout = new Layout(canvas, playerAsset);
    
    // Initialize the player
    player = new  Player(playerAsset,canvas);

    // Initialize enemies
    enemies = new EnemyPool(enemyAsset, enemy1Asset, enemy2Asset, canvas, ctx, player.score);  

    // Initialize shield
    var offSetX = 70;
    for(var i = 0; i < 4; i++)
    {
        const shield = new Shield({x: offSetX, y: 525});
        shields.push(shield);
        offSetX += 140;
    }
}



function Loop()
{  
    requestId = requestAnimationFrame(Loop);

    if(paused)
    {
        return;
    }

    var currentTime = Date.now();
    var deltaTime = currentTime - lastFrameTime;

    if(deltaTime < targetDelta)
    {
        return;
    }

    lastFrameTime = currentTime;
    fps = 1000 / deltaTime;

    // Update the game logic
    Update(deltaTime / 1000);
    
    // Draw the game elements
    Draw();
    //DrawStats(ctx, deltaTime, fps);

    CheckState();
}

function Update(deltaTime)
{
    // Update the background
    layout.Update(deltaTime);
    
    // Update the enemies
    enemies.Update(deltaTime, player.bullets.bullets);
    
    // Update the player
    player.Update(deltaTime, keyCodes, enemies.bulletsPool.bullets, enemies.playerScore);

    // Update shields
    shields.forEach(shield => shield.Update(player.bullets.bullets, enemies.bulletsPool.bullets))
}

function Draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw layout
    layout.Draw(ctx, player.lives, player.score, hiScore);
    
    // Draw player
    player.Draw(ctx);
    
    // Draw the enemies
    enemies.Draw(ctx);  

    // Draw shields
    shields.forEach(shield => shield.Draw(ctx));
}

function DrawStats(ctx, deltaTime, fps) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";

    ctx.fillText("deltatime: " + deltaTime.toFixed(4), 6, 50);
    ctx.fillText("FPS: " + fps.toFixed(2), 6, 14);
    // ctx.fillText("FPS: " + , 6, 32);
}

function CheckState()
{
    if(player.lives == 0)
    {
        cancelAnimationFrame(requestId);
        if(player.score > hiScore){localStorage.setItem("newhiScore", player.score);}      
        window.location.href = "../html/index.html";
        return;
    }

    if(enemies.enemies.length == 0 && player.canShot)
    {
        player.DeactivateBullets();
        player.canShot = false;
        setTimeout(function() {
            enemies = new EnemyPool(enemyAsset, enemy1Asset, enemy2Asset, canvas,ctx, player.score);
            enemies.fireRate -= 0.1;
            player.canShot = true;
        }, 3000); 
    }

    for(var i = 0; i < enemies.enemies.length; i++)
    {
        if(enemies.enemies[i].position.y >= player.position.y)
        {
            cancelAnimationFrame(requestId);
            if(player.score > hiScore){localStorage.setItem("newhiScore", player.score);}      
            window.location.href = "../html/index.html";
            return;
        }
    }
}

// Input setup
function SetupInput()
{
    document.addEventListener("keydown", function(evt)
    {
        if(evt.key === "D" || evt.key === "d" || evt.code === 68)
        {
            keyCodes.D = true;
        }

        if(evt.key === "A" || evt.key === "a" || evt.code === 65)
        {
            keyCodes.A = true;
        }

        if(evt.key === "Space" || evt.key === " " || evt.code === "Space")
        {
            keyCodes.space = true;
        }


    }, false);

    document.addEventListener("keyup", function(evt)
    {
        if(evt.key === "D" || evt.key === "d" || evt.code === 68)
        {
            keyCodes.D = false;
        }

        if(evt.key === "A" || evt.key === "a" || evt.code === 65)
        {
            keyCodes.A = false;
        }

        if(evt.key === "Space" || evt.key === " " || evt.code === "Space")
        {
            keyCodes.space = false;
        }

    }, false);
}

// Global navigators Loop()
window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
    window.setTimeout(callback, deltaTime * 1000);
    };
   }) ();

