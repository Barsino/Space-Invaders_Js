

class Shield
{
    constructor(position)
    {
        this.position = position;
        this.size = {x: 50, y: 50};

        this.active = true;

        this.colors = [
            "rgb(0, 128, 0)", // green
            "rgb(128, 128, 0)", // green_yellow
            "rgb(255, 255, 0)", // yellow
            "rgb(255, 165, 0)", // orange
            "rgb(255, 0, 0)" // red
        ];

        this.currentColor = this.colors.green;

        this.hits = 0;

        this.boundingRadius = 30;
    }

    Draw(ctx)
    {
        if(this.active)
        {
            // ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            // ctx.beginPath();
            // ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.boundingRadius, 0, 2 * Math.PI);
            // ctx.fill();
    
            ctx.fillStyle = this.colors[this.hits];
            ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }

    Update(playerBullets, enemyBullets)
    {
        if(this.active)
        {
            this.BulletCollision(playerBullets);
            this.BulletCollision(enemyBullets);
        }
    }

    BulletCollision(bullets)
    {
        if(bullets !== null)
        {
            for(let i = 0; i < bullets.length; i++)
            {       
                const bullet = bullets[i];
    
                const dx = Math.abs((this.position.x + this.size.x / 2) - bullet.position.x);
                const dy = Math.abs((this.position.y + this.size.y / 2) - bullet.position.y);
    
                const dist = Math.sqrt((dx * dx) + (dy * dy));
    
                if(dist <= this.boundingRadius)
                {
                    bullet.active = false;
                    bullet.position = {x: 0, y: 0};

                    if(this.hits >= 4)
                    {
                        this.Deactivate();
                    }
                    else
                    {
                        this.hits++;
                    }

                    break;
                }
            }
        }
    }

    Deactivate()
    {
        this.active = false;
    }
}