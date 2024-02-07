
class Player
{
    constructor(img, canvas)
    {
        
        this.img = img;
        
        this.canvas = canvas;
        
        this.position = {x: canvas.width / 2, y: canvas.height - 100};

        this.speed = 130;

        this.size = {x: 40, y: 20};
        this.boundingRadius = 15

        this.bullets = new BulletPool(this, 10);

        this.canShot = true;
        this.fireRate = 0.75;
        this.fireRateAux = 0;
        this.cannonOffset = {x: 15, y: -5};

        this.lives = 1;
        this.active = true;

        this.score = 0;
    }



    Update(deltaTime, keyCode, enemyBullets, score)
    {
        if(this.active)
        {
            // Move player
            this.Move(deltaTime, keyCode);
            
            // Shot
            this.Shot(deltaTime, keyCode);

            this.BulletEnemyCollision(enemyBullets);

            this.score += (score - this.score);
        }
    }

    Draw(ctx)
    {
        if(this.active)
        {
            ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y); 

            // ctx.fillStyle = "rgba(255, 0, 0, 0.2";
            // ctx.beginPath();
            // ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.boundingRadius, 0, 2 * Math.PI);
            // ctx.fill();
    
            this.bullets.Draw(ctx);
        }
    }

    Move(deltaTime, keyCodes)
    {
        if(keyCodes.A && this.position.x > 0)
        {
            this.position.x = this.position.x - this.speed * deltaTime;
        }

        if(keyCodes.D && this.position.x < this.canvas.width - this.size.x)
        {
            this.position.x = this.position.x + this.speed * deltaTime;
        }
    }

    Shot(deltaTime, keyCodes)
    {
        if(this.canShot)
        {
            this.fireRateAux += deltaTime;

            if(this.fireRateAux >= this.fireRate && keyCodes.space)
            {
                let bullet = this.bullets.Activate();

                if(bullet !== null)
                {
                    bullet.position.x = this.position.x + this.cannonOffset.x;
                    bullet.position.y = this.position.y + this.cannonOffset.y;
                    bullet.rotation = -Math.PI / 2;
                }

                this.fireRateAux = 0;
            }

            this.bullets.Update(deltaTime);
        }
    } 
    
    BulletEnemyCollision(enemyBullets)
    {
        if(enemyBullets !== null)
        {
            for(let i = 0; i < enemyBullets.length; i++)
            {       
                const bullet = enemyBullets[i];
    
                const dx = Math.abs((this.position.x + this.size.x / 2) - bullet.position.x);
                const dy = Math.abs((this.position.y + this.size.y / 2) - bullet.position.y);
    
                const dist = Math.sqrt((dx * dx) + (dy * dy));
    
                if(dist <= this.boundingRadius)
                {
                    bullet.active = false;
                    bullet.position = {x: 0, y: 0};

                    this.lives --;

                    if(this.lives <= 0)
                    {
                        this.Deactivate();
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

    DeactivateBullets()
    {
        this.bullets.bullets.forEach(bullet => this.bullets.Deactivate(bullet));
    }
}
