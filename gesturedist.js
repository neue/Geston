var particleLimit = 100;
var particles = [];
var gestureMapped = 0;
var sensorImg;
var beamTop = 100;
var beamBottom = 350;
var beamSpread = 75;
var canvas,context;

document.addEventListener('DOMContentLoaded', function () {
  canvas = document.getElementById('particleCanvas');
  context = canvas.getContext('2d');    
  sensors.connect();
  for (var i = 0; i < particleLimit; i++) {
    particles.push(new Particle(random(0,canvas.width),random(0,canvas.height)));
  }
  window.requestAnimationFrame(draw);
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
  
  gestureMapped = lerp(beamTop - 50,beamBottom - 15,sensorGesture.proximity/255);
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
  this.life = random(0.7,1.3);
  this.color = lerpColor(55,152,245,46,113,163,Math.random());
  this.dist = 500;
  this.resetPosition();
}

Particle.prototype.resetPosition = function() {
  this.y = random(Math.max(gestureMapped,beamTop),beamBottom);
  this.x = canvas.width/2 + random(
    lerp(beamSpread,0,(this.y - beamTop) / (beamBottom - beamTop)),
    lerp(-beamSpread,0,(this.y - beamTop) / (beamBottom - beamTop))
  );
};

Particle.prototype.render = function() {
  if (this.dist < 30) {
    var highlight = lerpColor(this.color[0],this.color[1],this.color[2],194,27,64,this.dist/30);
    ellipse(this.x,this.y,lerp(0,30,this.life));
    fill(highlight[0],highlight[1],highlight[2]);
  } else {
    ellipse(this.x,this.y,lerp(0,20,this.life));
    fill(this.color[0],this.color[1],this.color[2]);
  }
};

Particle.prototype.update = function() {
  if (this.life <= 0.0) {
    this.resetPosition();    
    this.life = random(0.7,1.3);
  }

  if (this.y < gestureMapped) {
    this.life -= 0.04;    
  } else {
    this.life -= 0.02;        
  }


  this.dist = Math.abs(this.y - gestureMapped);
  if (this.dist < 30) {
    this.x += this.xVel*15;
    this.y -= Math.abs(canvas.width/2 - this.x)*0.02;
  } else {
    this.x += this.xVel*3;
    this.y += this.xVel;
  }

};


