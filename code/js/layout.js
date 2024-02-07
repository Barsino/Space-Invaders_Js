

class Layout
{
    constructor(canvas, playerImg)
    {
        this.canvas = canvas;

        this.playerImg = playerImg;
        this.playerImgSize = {x: 30, y: 15};
    }

    Update(deltaTime)
    {
        
    }

    Draw(ctx, playerLives, score, hiScore)
    {
        // Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Score
        this.Score(ctx, score, hiScore);

        // Lievs display
        this.PlayerLives(ctx, playerLives);

    }

    PlayerLives(ctx, playerLives)
    {
        ctx.fillStyle = "green";
        ctx.fillRect(20, this.canvas.height - 60, this.canvas.width - 40, 3);

        ctx.fillStyle = "white";
        ctx.font = '15px "Press Start 2P", sans-serif';
        ctx.fillText(playerLives.toString(), 50, this.canvas.height - 35);

        var offset = 0;
        for(var i = 0; i < playerLives - 1; i++)
        {
            ctx.drawImage(this.playerImg, 80 + offset, this.canvas.height - 52, 
                this.playerImgSize.x, this.playerImgSize.y);    
            
            offset += this.playerImgSize.x + 10;
        }

        ctx.fillStyle = "white";
        ctx.font = '15px "Press Start 2P", sans-serif';
        ctx.fillText("CREDIT 00", this.canvas.width - 200, this.canvas.height - 35);
    }

    Score(ctx, score, hiScore)
    {
        ctx.fillStyle = "white";
        ctx.font = '15px "Press Start 2P", sans-serif';
        ctx.fillText("SCORE<1> HI-SCORE SCORE<2>", 100, 30);
        ctx.fillText(score.toString().padStart(4, "0"), 110, 60);
        ctx.fillText(hiScore.toString().padStart(4, "0"), 250, 60);
    }

    // Generates a random number between a min and a max
    RandomBetween(min, max)
    {
        return min + Math.floor(Math.random() * (max - min));
    }
}