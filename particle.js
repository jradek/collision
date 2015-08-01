var particle = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: 1,
    radius: 0,
    bounce: -1,
    friction: 1,
    gravity: 0,
    springs: null,
    gravitations: null,

    create: function (x, y, speed, direction, grav) {
        "use strict";
        var obj = Object.create(this);
        obj.x = x;
        obj.y = y;
        obj.vx = Math.cos(direction) * speed;
        obj.vy = Math.sin(direction) * speed;
        obj.gravity = grav || 0;
        obj.springs = [];
        obj.gravitations = [];
        return obj;
    },

    addGravitation: function (p) {
        "use strict";
        this.removeGravitation(p);
        this.gravitations.push(p);
    },

    removeGravitation: function (p) {
        "use strict";
        var i = 0;
        for (i = 0; i < this.gravitations.length; i += 1) {
            if (p === this.gravitations[i]) {
                this.gravitations.splice(i, 1);
                return;
            }
        }
    },

    addSpring: function (point, k, length) {
        "use strict";
        this.removeSpring(point);
        this.springs.push({
            point: point,
            k: k,
            length: length || 0
        });
    },

    removeSpring: function (point) {
        "use strict";
        var i = 0;
        for (i = 0; i < this.springs.length; i += 1) {
            if (point === this.springs[i].point) {
                this.springs.splice(i, 1);
                return;
            }
        }
    },

    getSpeed: function () {
        "use strict";
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    },

    setSpeed: function (speed) {
        "use strict";
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    getHeading: function () {
        "use strict";
        return Math.atan2(this.vy, this.vx);
    },

    setHeading: function (heading) {
        "use strict";
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    accelerate: function (ax, ay) {
        "use strict";
        this.vx += ax;
        this.vy += ay;
    },

    update: function () {
        "use strict";
        this.handleSprings();
        this.handleGravitations();
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    },

    handleGravitations: function () {
        "use strict";
        var i = 0;
        for (i = 0; i < this.gravitations.length; i += 1) {
            this.gravitateTo(this.gravitations[i]);
        }
    },

    handleSprings: function () {
        "use strict";
        var i = 0,
            spring = null;
        for (i = 0; i < this.springs.length; i += 1) {
            spring = this.springs[i];
            this.springTo(spring.point, spring.k, spring.length);
        }
    },

    angleTo: function (p2) {
        "use strict";
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    },

    distanceTo: function (p2) {
        "use strict";
        var dx = p2.x - this.x,
            dy = p2.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function (p2) {
        "use strict";
        var dx = p2.x - this.x,
            dy = p2.y - this.y,
            distSQ = dx * dx + dy * dy,
            dist = Math.sqrt(distSQ),
            force = p2.mass / distSQ,
            ax = dx / dist * force,
            ay = dy / dist * force;

        this.vx += ax;
        this.vy += ay;
    },

    springTo: function (point, k, length) {
        "use strict";
        var dx = point.x - this.x,
            dy = point.y - this.y,
            distance = Math.sqrt(dx * dx + dy * dy),
            springForce = (distance - length || 0) * k;
        this.vx += dx / distance * springForce;
        this.vy += dy / distance * springForce;
    }
};
