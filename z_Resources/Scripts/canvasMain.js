"use strict";

// Creating Canvas
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    hue = 217,
    stars = [],
    count = 0,
    maxStars = 300, // Max number of stars in animation
    h,
    w,
    fps = 30, // Frame rate limit
    now,
    then = Date.now(),
    interval = 1000 / fps,
    delta;

// Sets Canvas Size
const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = canvas.width;
    h = canvas.height;
}

setCanvasSize();

// Returns a random number between a given minimum and maximum
function randomNum(min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }

    if (min > max) {
        var hold = max;
        max = min;
        min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculates the orbit a star can have from the center of the canvas.
function Orbit(positionX, positionY) {
    var max = Math.max(positionX, positionY),
        diameter = Math.round(Math.sqrt(max * max + max * max));

    return diameter / 2;
}

// Creating star objects
var Star = function () {
    this.orbitRadius = randomNum(Orbit(w, h)); // distance from center aka radius
    this.radius = randomNum(60, this.orbitRadius) / 12; // size of star
    this.orbitX = w / 2; // stars center for point X
    this.orbitY = h / 2; // stars center for point Y
    this.time = randomNum(0, maxStars);  // controls the star in its orbit
    this.speed = randomNum(this.orbitRadius) / 500000; // speed of star orbit
    this.alpha = randomNum(2, 10) / 10; // Luminance of star
    this.hue = randomNum(160, 345); // Random hue for the star (chose purple to cyan)

    count++;
    stars[count] = this; // adds star object to stars array
}

// Stars will not show up until we draw them on the canvas
Star.prototype.draw = function () {
    var x = Math.sin(this.time) * this.orbitRadius + this.orbitX,
        y = Math.cos(this.time) * this.orbitRadius + this.orbitY,
        twinkle = randomNum(10); // Randomize the star lumen

    // If the star too bright reduce the opacity
    if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05;

    // If the star too faint raise the opacity
    } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha; // Set star brightness here

    // Create a radial gradient for each star
    let gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
    gradient.addColorStop(.025, '#fff');
    gradient.addColorStop(.1, `hsl(${this.hue}, 61%, 42%)`);
    gradient.addColorStop(.25, `hsl(${this.hue}, 64%, 6%)`);
    gradient.addColorStop(1, 'transparent');

    // Set the gradient as the fill style
    ctx.fillStyle = gradient;

    // Draw the star with the gradient
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    this.time += this.speed;
}

// Creating Stars Objects using a loop
const starCreation = () => {
    stars = [];
    count = 0;
    for (var i = 0; i < maxStars; i++) {
        new Star();
    }
}

// Function to wrap text
const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

// Animating the Text and Stars
const animation = () => {
    requestAnimationFrame(animation);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = `#05050E`;
        ctx.fillRect(0, 0, w, h);

        // Adjust Text Position based on Canvas Width size
        const baseLineHeight = 75;
        let adjustedLineHeight = baseLineHeight;

        // Adding Text on top of Canvas
        ctx.font = 'normal 90px "Alex Brush"';
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';

        const maxTextWidth = w * 0.8;

        // Draw Text
        const firstTextY = h / 2 - adjustedLineHeight / 2;
        wrapText(ctx, 'Alexandra Winters', w / 2, firstTextY, maxTextWidth, adjustedLineHeight);

        ctx.font = 'normal 16px "SUSE"';

        let secondTextY = 0;
        if (w < 845) {
            secondTextY = firstTextY + adjustedLineHeight + 40;
        } else {
            secondTextY = firstTextY + adjustedLineHeight
        }
        wrapText(ctx, 'Front-End Developer / Graphic Designer', w / 2, secondTextY, maxTextWidth, adjustedLineHeight);
        
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, x = stars.length; i < x; i++) {
            stars[i].draw();
        }
    }
}

// Initial Star Creation
starCreation();
animation();

// Making Canvas Responsive
window.addEventListener('resize', () => {
    setCanvasSize();
    starCreation();
});

// For optimization, pause animation when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animation);
    } else {
        animation();
    }
});
