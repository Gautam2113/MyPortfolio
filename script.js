/*for background particl*/
/*--------------------
Vars
--------------------*/
const deg = a => Math.PI / 180 * a;
const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));
const opt = {
  particles: window.width / 500 ? 1000 : 500,
  noiseScale: 0.009,
  angle: Math.PI / 180 * -90,
  h1: rand(0, 360),
  h2: rand(0, 360),
  s1: rand(20, 90),
  s2: rand(20, 90),
  l1: rand(30, 80),
  l2: rand(30, 80),
  strokeWeight: 1.2,
  tail: 82 };

const Particles = [];
let time = 0;
document.body.addEventListener('click', () => {
  opt.h1 = rand(0, 360);
  opt.h2 = rand(0, 360);
  opt.s1 = rand(20, 90);
  opt.s2 = rand(20, 90);
  opt.l1 = rand(30, 80);
  opt.l2 = rand(30, 80);
  opt.angle += deg(random(60, 60)) * (Math.random() > .5 ? 1 : -1);

  for (let p of Particles) {
    p.randomize();
  }
});


/*--------------------
Particle
--------------------*/
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lx = x;
    this.ly = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.hueSemen = Math.random();
    this.hue = this.hueSemen > .5 ? 20 + opt.h1 : 20 + opt.h2;
    this.sat = this.hueSemen > .5 ? opt.s1 : opt.s2;
    this.light = this.hueSemen > .5 ? opt.l1 : opt.l2;
    this.maxSpeed = this.hueSemen > .5 ? 3 : 2;
  }

  randomize() {
    this.hueSemen = Math.random();
    this.hue = this.hueSemen > .5 ? 20 + opt.h1 : 20 + opt.h2;
    this.sat = this.hueSemen > .5 ? opt.s1 : opt.s2;
    this.light = this.hueSemen > .5 ? opt.l1 : opt.l2;
    this.maxSpeed = this.hueSemen > .5 ? 3 : 2;
  }

  update() {
    this.follow();

    this.vx += this.ax;
    this.vy += this.ay;

    var p = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    var a = Math.atan2(this.vy, this.vx);
    var m = Math.min(this.maxSpeed, p);
    this.vx = Math.cos(a) * m;
    this.vy = Math.sin(a) * m;

    this.x += this.vx;
    this.y += this.vy;
    this.ax = 0;
    this.ay = 0;

    this.edges();
  }

  follow() {
    let angle = noise(this.x * opt.noiseScale, this.y * opt.noiseScale, time * opt.noiseScale) * Math.PI * 0.5 + opt.angle;

    this.ax += Math.cos(angle);
    this.ay += Math.sin(angle);

  }

  updatePrev() {
    this.lx = this.x;
    this.ly = this.y;
  }

  edges() {
    if (this.x < 0) {
      this.x = width;
      this.updatePrev();
    }
    if (this.x > width) {
      this.x = 0;
      this.updatePrev();
    }
    if (this.y < 0) {
      this.y = height;
      this.updatePrev();
    }
    if (this.y > height) {
      this.y = 0;
      this.updatePrev();
    }
  }

  render() {
    stroke(`hsla(${this.hue}, ${this.sat}%, ${this.light}%, .5)`);
    line(this.x, this.y, this.lx, this.ly);
    this.updatePrev();
  }}



/*--------------------
Setup
--------------------*/
let canvas;
function setup() {
  canvas=createCanvas(windowWidth, windowHeight);
  canvas.parent('Home');
  for (let i = 0; i < opt.particles; i++) {
    Particles.push(new Particle(Math.random() * width, Math.random() * height));
  }
  strokeWeight(opt.strokeWeight);
}


/*--------------------
Draw
--------------------*/
function draw() {
  if (document.getElementById('Home'))
  time++;
  background(0, 100 - opt.tail);

  for (let p of Particles) {
    p.update();
    p.render();
  }
}

/*for the centre text*/ 
/*--------------------
Resize
--------------------*/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#;~________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }}


// ——————————————————————————————————————————————————
// TEXT
// ——————————————————————————————————————————————————

const phrases = [
'Hello World,',
'I am Gautam Tyagi',
'A Web Developer',
'A Web Designer',
'An App Developer',
'A Student',
'Its nice to see you!'];


const el = document.querySelector('.text');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 1600);
  });
  counter = (counter + 1) % phrases.length;
};

next();
