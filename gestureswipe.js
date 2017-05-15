var particleLimit = 100;
var particles = [];
var sensorImg;
var beamTop = 100;
var beamBottom = 350;
var beamSpread = 75;
var canvas,context;

document.addEventListener('DOMContentLoaded', function () {
  canvas = document.getElementById('particleCanvas');
  context = canvas.getContext('2d');    
  for (var i = 0; i < particleLimit; i++) {
    particles.push(new Particle(random(0,canvas.width),random(0,canvas.height)));
  }
  window.requestAnimationFrame(draw);
  document.onkeydown = checkKey;
});

function random(min, max) {
  var rand;
  rand = Math.random();
  if (typeof min === 'undefined') {
    return rand;
  } else
  if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }
    return rand * (max-min) + min;
  }
}

function lerp(start, stop, amt) {
  return amt*(stop-start)+start;
}

function lerpColor(r1,g1,b1,r2,g2,b2,amt) {
  amt = Math.min(1,amt);
  return [Math.round(lerp(r1,r2,amt)),Math.round(lerp(g1,g2,amt)),Math.round(lerp(b1,b2,amt))];
}

function fill(_r,_g,_b) {
  context.fillStyle = 'rgb('+_r+','+_g+','+_b+')';
  context.fill();
}

function ellipse(_x,_y,_w,_h) {
  if (_w < 0) { _w = 0; }
  context.beginPath();
  context.arc(_x-(_w/2), _y-(_w/2), _w/2, 0, Math.PI*2, true);     
  context.closePath(); 
}


function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].render();
  }
  window.requestAnimationFrame(draw);
}



function Particle(_x,_y) {
  this.x = _x;
  this.y = _y;
  this.xVel = random(-0.5,0.5);
  this.YVel = 0;
  this.life = random(0.7,1.3);
  this.resetPosition();
}

Particle.prototype.resetPosition = function() {
  this.xVel = random(-0.5,0.5);
  this.yVel = 0;
  this.y = random(beamTop,beamBottom);
  this.x = canvas.width/2 + random(
    lerp(beamSpread,0,(this.y - beamTop) / (beamBottom - beamTop)),
    lerp(-beamSpread,0,(this.y - beamTop) / (beamBottom - beamTop))
  );
  this.baseColor = lerpColor(55,152,245,46,113,163,Math.random());
  this.color = this.baseColor;
  
};

Particle.prototype.render = function() {
    // var highlight = lerpColor(this.color[0],this.color[1],this.color[2],194,27,64,this.dist/30);
    // ellipse(this.x,this.y,lerp(0,30,this.life));
    // fill(highlight[0],highlight[1],highlight[2]);
    ellipse(this.x,this.y,lerp(0,20,this.life));
    fill(this.color[0],this.color[1],this.color[2]);
};

Particle.prototype.update = function() {
  if (this.life <= 0.0) {
    this.resetPosition();    
    this.life = random(0.7,1.3);
  }
  this.life -= 0.02;        
  this.x += this.xVel*3;
  this.y += this.yVel + this.xVel;
  this.color = lerpColor(this.baseColor[0],this.baseColor[1],this.baseColor[2],this.color[0],this.color[1],this.color[2],0.99);
};


// Fake Swipes
function checkKey(e) {

    e = e || window.event;
    
    if (e.keyCode == '38') {
    // Forward Swipe
      pulse(-1,0);
    }
    else if (e.keyCode == '40') {
    // Backward Swipe
      pulse(1,0);
    }
    else if (e.keyCode == '37') {
    // Left Swipe
      pulse(-1,2);
    }
    else if (e.keyCode == '39') {
    // Right Swipe
      pulse(1,-2);
    }

}

function pulse(_x,_y){
  for (var i = 0; i < particles.length; i++) {
    particles[i].color = [194,27,64];
    particles[i].xVel = _x;
    particles[i].yVel = _y;
  }
}
