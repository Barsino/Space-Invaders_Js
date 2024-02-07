
class Bullet
{
    constructor()
    {
        this.position = {x: 0, y: 0};
        this.rotation = 0;

        this.speed = 400;
        this.damage = 0;

        this.active = false;
        this.owner = null;

        this.onDeactive = null;
    }

    Update(deltaTime)
    {
        this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
        this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;

        if(this.position.y < 85 || this.position.y > 640)
        {
            this.onDeactive(this);
        }
    }

    Draw(ctx)
    {
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x - 1, this.position.y - 8, 2, 10);
    }
}

class BulletPool
{
    constructor(owner, maxSize)
    {
        this.owner = owner;

        this.bullets = [];

        // Initialize the bullet pool array
        for(let i = maxSize; i > 0; i--)
        {
            const bullet = new Bullet();
            bullet.owner = this.owner;

            bullet.onDeactive = this.Deactivate;

            this.bullets.push(bullet);
        }
    }

    Activate()
    {
        let bullet = null;
        let i = 0;

        while(bullet == null && i < this.bullets.length)
        {
            if(!this.bullets[i].active)
            {
                bullet = this.bullets[i];
            }
            else
            {
                i++;
            }
        }

        if(bullet != null)
        {
            bullet.active = true;
        }
        return bullet;
    }

    Deactivate(bullet)
    {
        bullet.active = false;
        bullet.position = {x: 0, y: 0};
    }

    Update(deltaTime)
    {
        this.bullets.forEach(bullet =>
            {
                if(bullet.active)
                {
                    bullet.Update(deltaTime);                    
                }
            });
    }

    Draw(ctx)
    {
        this.bullets.forEach(bullet => 
            {
                if(bullet.active)
                {
                    bullet.Draw(ctx);
                }
            })
    }
}