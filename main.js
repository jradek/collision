window.onload = function () {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        playgroundWidth = 640,
        playgroundHeight = 480,
        playgroundX = (width - playgroundWidth) / 2,
        playgroundY = (height - playgroundHeight) / 2,
        particles = [],
        targets = [],
        angles = [],
        magnitudes = [],
        numParticles = 80,
        i,
        j,
        // frame rate handling
        fps,
        fpsInterval,
        now,
        then,
        elapsed;
            
    function randomPoint() {
        return { x: playgroundX + Math.random() * playgroundWidth,
            y: playgroundY + Math.random() * playgroundHeight };
    }
    
    function initializeParticles() {
        for (i = 0; i < numParticles; i++) {
            var p1 = randomPoint(),
                p2 = randomPoint(),
                p = particle.create(p1.x, p1.y, 0, 0),
                t = particle.create(p2.x, p2.y, 0, 0);

            particles.push(p);
            targets.push(t);

            angles.push(0);
            magnitudes.push(0);
        }
    }
    
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        update();
    }
            
    initializeParticles();
    startAnimating(30);
        
    
    function algorithm() {
        for (i = 0; i < numParticles; i++) {
            var p = particles[i],
                t = targets[i],
                angle = p.angleTo(t),
                dx = Math.cos(angle),
                dy = Math.sin(angle);
            
            for(j = 0; j < numParticles; j++) {                
                if (i == j) {
                    continue;
                }
                
                var otherP = particles[j],
                    d = p.distanceTo(otherP),
                    a = otherP.angleTo(p),
                    coef = 425 / (d * d);
                
                dx = dx + Math.cos(a) * coef;
                dy = dy + Math.sin(a) * coef;
            }

            angle = Math.atan2(dy, dx);
            angles[i] = angle;
            magnitudes[i] = Math.sqrt(dx * dx + dy * dy);
        }
        
        for (i = 0; i < numParticles; i++) {
            var p = particles[i],
                t = targets[i],
                angle = angles[i],
                magnitude = magnitudes[i],
                speed = Math.min(1, 0.2 + magnitude * 0.8),
                baseSpeed = 5,
                dx = Math.cos(angle) * baseSpeed * speed,
                dy = Math.sin(angle) * baseSpeed * speed;
                                
            p.velocity.setX(dx);        
            p.velocity.setY(dy);
            
            p.update();
            
            if (p.distanceTo(t) < 10) {
                var newTarget = randomPoint();
                targets[i].position.setX(newTarget.x);
                targets[i].position.setY(newTarget.y);
            }                
        }
        
    }
        
    function update() {
        
        requestAnimationFrame(update);
        
        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            then = now - (elapsed % fpsInterval);
        
            context.clearRect(0, 0, width, height);
        
            algorithm();

            context.beginPath();
            context.rect(playgroundX, playgroundY, playgroundWidth, playgroundHeight);
            context.stroke();                

            // draw routine
            for (i = 0; i < numParticles; i++) {
                var p = particles[i];

                if (i === 0) {
                    // draw target
                    context.beginPath();
                    context.fillStyle = "#00FF00";
                    context.arc(targets[i].position.getX(), targets[i].position.getY(), 3, 0, Math.PI * 2, false);
                    context.fill();
                    
                    context.fillStyle = "#FF0000";
                } else {
                    context.fillStyle = "#000000";
                }
                
                // draw particle
                context.beginPath();
                context.arc(p.position.getX(), p.position.getY(), 3, 0, Math.PI * 2, false);
                context.fill();
            }
        }
    }
};