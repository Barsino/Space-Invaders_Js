class Enemy
{
    constructor(img, position, score)
    {
        this.img = img;

        this.position = position;

        this.boundingRadius = 20;

        this.size = {x: 40, y: 40};

        this.speed = 30;
        this.downDistance = 10;

        this.score = score;
    }


    Update(deltaTime)
    {
        this.Move(deltaTime);
    }

    Draw(ctx)
    {
        
        // ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        // ctx.beginPath();
        // ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.boundingRadius, 0, 2 * Math.PI);
        // ctx.fill();
        
        ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
    }

    Move(deltaTime)
    {
        this.position.x += this.speed * deltaTime;
    }
    
    ChaseDir()
    {      
        this.speed *= -1;
        this.position.y += this.downDistance;
    }
}

class EnemyPool
{
    constructor(enemyAsset, enemy1Asset, enemy2Asset, canvas, ctx, playerScore)
    {
        this.enemyAsset = enemyAsset;
        this.enemy1Asset = enemy1Asset;
        this.enemy2Asset = enemy2Asset;

        this.enemies = [];

        this.SetupEnemies(1, 9, enemy1Asset, 100, 100, 30);
        this.SetupEnemies(2, 9, enemy2Asset, 100, 150, 20);
        this.SetupEnemies(2, 9, enemyAsset, 100, 250, 10);

        this.canvas = canvas;
        this.ctx = ctx;

        this.bulletsPool = new BulletPool(this, 5);

        this.fireRate = 1;
        this.fireRateAux = 0;
        this.cannonOffset = {x: 20, y: 40};

        this.playerScore = playerScore;
    }

    Shot(deltaTime)
    {
        this.fireRateAux += deltaTime;

        if(this.fireRateAux >= this.fireRate)
        {
            let bullet = this.bulletsPool.Activate();

            if(bullet !== null && this.enemies.length !== 0)
            {
                var rdn = this.RandomBetween(0, this.enemies.length - 1);
                bullet.position.x = this.enemies[rdn].position.x + this.cannonOffset.x;
                bullet.position.y = this.enemies[rdn].position.y + this.cannonOffset.y;
                bullet.rotation = Math.PI / 2;
            }

            this.fireRateAux = 0;
        }

        this.bulletsPool.Update(deltaTime);
    }  

    Update(deltaTime, playerBullets)
    {
        this.EnemyControll();
        this.enemies.forEach(enemy => enemy.Update(deltaTime));

        this.Shot(deltaTime);

        this.BulletPlayerCollision(playerBullets);
    }

    Draw(ctx)
    {
        this.enemies.forEach(enemy => enemy.Draw(ctx));
        
        this.bulletsPool.Draw(ctx);
    }

    
    SetupEnemies(rows, columns, enemyAsset, initialX, initialY, score)
    {
        let posx = initialX;
        let posy = initialY;

        for(let i = 0; i < rows; i++)
        {
            for(let j = 0; j < columns; j++)
            {
                const enemy = new Enemy(enemyAsset, {x: posx, y: posy}, score);
                this.enemies.push(enemy);

                posx += 50;
            }

            posx = initialX;
            posy += 50;
        }
    }

    BulletPlayerCollision(playerBullets)
    {
        for(let i = 0; i < this.enemies.length; i++)
        {
            const enemy = this.enemies[i];

            for(let j = 0; j < playerBullets.length; j++)
            {       
                const bullet = playerBullets[j];

                const dx = Math.abs((enemy.position.x + enemy.size.x / 2) - bullet.position.x);
                const dy = Math.abs((enemy.position.y + enemy.size.y / 2) - bullet.position.y);

                const dist = Math.sqrt((dx * dx) + (dy * dy));

                if(dist <= enemy.boundingRadius)
                {
                    bullet.active = false;
                    bullet.position = {x: 0, y: 0};

                    this.enemies.splice(i, 1);

                    this.playerScore += enemy.score;

                    break;
                }
            }
        }
    }


    EnemyControll()
    {
        if(this.enemies.length !== 0)
        {
            for(let i = 0; i < this.enemies.length; i++)
            {
                if(this.enemies[i].position.x < 20 || this.enemies[i].position.x + this.enemies[i].size.x + 20 > this.canvas.width)
                {
                    this.enemies.forEach(enemy => enemy.ChaseDir());

                    break;
                }
            }
        }
    }

    // Generates a random number between a min and a max
    RandomBetween(min, max)
    {
        return min + Math.floor(Math.random() * (max - min));
    }
}