document.addEventListener('DOMContentLoaded', Init);

var canvas = /** @type {HTML CanvasElement} */(null);
var  ctx = /** @type {CanvasRenderingContext2D} */(null);

enemyAsset = null;
enemy1Asset = null;
enemy2Asset = null;
enemy3Asset = null;

var button = document.getElementById("playButton");

var hiScore;

function Init()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    enemyAsset = new Image();
    enemyAsset.src = "../../assets/Enemy_Sprite.png";

    enemy1Asset = new Image();
    enemy1Asset.src = "../../assets/Enemy1_Sprite.png";

    enemy2Asset = new Image();
    enemy2Asset.src = "../../assets/Enemy2_Sprite.png";

    if(!localStorage.getItem("newhiScore"))
    {
        localStorage.setItem("newhiScore", 0);
    }
    
    hiScore = localStorage.getItem("newhiScore");

    Draw();
}

function Draw()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = '15px "Press Start 2P", sans-serif';
    ctx.fillText("SCORE<1> HI-SCORE SCORE<2>", 100, 30);
    ctx.fillText("0000", 110, 60);
    ctx.fillText(hiScore.toString().padStart(4, "0"), 250, 60);

    button.addEventListener("click", function() {
        window.location.href = "../html/game.html";
    });
    
    ctx.fillStyle = "white";
    ctx.font = '15px "Press Start 2P", sans-serif';
    ctx.fillText("PLAY", 250, 180);

    ctx.fillText("SPACE  INVADERS", 190, 230);

    ctx.fillText("*SCORE ADVANCE TABLE*", 140, 350);
    ctx.drawImage(enemy1Asset, 200, 370, 30, 30);
    ctx.fillText("= 30  POINTS", 240, 395);
    ctx.drawImage(enemy2Asset, 200, 420, 30, 30);
    ctx.fillText("= 20  POINTS", 240, 445);
    ctx.drawImage(enemyAsset, 200, 470, 30, 30);
    ctx.fillText("= 10  POINTS", 240, 495);

    ctx.fillText("CREDIT 00", this.canvas.width - 200, this.canvas.height - 35);
}