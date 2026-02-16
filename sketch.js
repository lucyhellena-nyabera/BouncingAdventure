// ------------------ VARIABLES ------------------
let stars = [];
let score = 0;

let player;
let sidekick;
let groundY = 350; // Y position of the ground
let gameOver = false; // track if game has ended

// ------------------ SETUP ------------------
function setup() {
  createCanvas(600, 400);
  player = new Player(width / 2, groundY - 25); // start on ground
  sidekick = new Sidekick(player.x - 50, groundY - 15); // sidekick left of player

  // spawn 3 stars
  for (let i = 0; i < 3; i++) {
    stars.push(new Star());
  }
}

// ------------------ DRAW ------------------
function draw() {
  background(135, 206, 235); // sky blue

  // draw ground
  fill(34, 139, 34);
  rect(0, groundY, width, height - groundY);

  // display score
  fill(0);
  textSize(20);
  text("Score: " + score, 10, 30);

  if (!gameOver) {
    // display stars
    for (let s of stars) {
      s.show();
    }

    // check star collection
    for (let i = stars.length - 1; i >= 0; i--) {
      let d = dist(player.x, player.y, stars[i].x, stars[i].y);
      if (d < player.r + stars[i].r) {
        stars.splice(i, 1);
        stars.push(new Star());
        score++;
      }
    }

    // update player and sidekick
    player.update();
    player.show();
    sidekick.follow(player);
    sidekick.show();

    // check win condition
    if (score >= 10) {
      gameOver = true;
    }
  } else {
    // Game Over / Level Complete message
    fill(255, 0, 0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Level Complete!", width / 2, height / 2);
  }
}


// ------------------ PLAYER JUMP ------------------
function keyPressed() {
  if (keyCode === UP_ARROW && player.onGround()) {
    player.jump();
  }
}

// ------------------ PLAYER CLASS ------------------
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 25;
    this.ySpeed = 0;
  }

  show() {
    fill(255, 100, 100); // red circle
    ellipse(this.x, this.y, this.r * 2);
  }

  update() {
    // gravity
    this.ySpeed += 0.6;
    this.y += this.ySpeed;

    // ground collision
    if (this.y > groundY - this.r) {
      this.y = groundY - this.r;
      this.ySpeed = 0;
    }

    // left/right movement
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;

    // keep inside canvas
    this.x = constrain(this.x, this.r, width - this.r);
  }

  jump() {
    this.ySpeed = -12;
  }

  onGround() {
    return this.y === groundY - this.r;
  }
}

// ------------------ STAR CLASS ------------------
class Star {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(50, groundY - 50); // float above ground
    this.r = 20;
  }

  show() {
    fill(255, 223, 0); // yellow
    ellipse(this.x, this.y, this.r * 2);
  }
}

// ------------------ SIDEKICK CLASS ------------------
class Sidekick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 15; // smaller than player
  }

  show() {
    fill(100, 200, 255); // blue color
    ellipse(this.x, this.y, this.r * 2);
  }

  follow(player) {
    // smooth following movement
    this.x += (player.x - this.x) * 0.05;
    this.y += (player.y - this.y) * 0.05;

    // stay above ground
    this.y = constrain(this.y, 0, groundY - this.r);
  }
}
