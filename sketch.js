let bubbles = [];
let explosions = []; // 儲存爆炸效果
let colors = [ '#ffc2d1', '#ffb3c6', '#ff8fab', '#fb6f92']; // 泡泡顏色陣列
let screenShake = 0; // 畫面抖動強度
let flashAlpha = 0; // 閃光透明度
let explosionSound; // 爆破音效
let soundEnabled = false; // 音效開關狀態（初始為未開啟）
let soundButtonX, soundButtonY, soundButtonW, soundButtonH;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(48);
  textAlign(CENTER, CENTER);
  // 載入爆破音效（需有 explosion.mp3 檔案在專案根目錄或 libraries/）
  if (typeof loadSound === 'function') {
    explosionSound = loadSound('libraries/explosion.mp3', () => {}, () => {});
  }

  // 音效開關按鈕位置與大小
  soundButtonW = 160;
  soundButtonH = 48;
  soundButtonX = windowWidth - soundButtonW - 32;
  soundButtonY = windowHeight - soundButtonH - 32;
}

function draw() {
  // 畫面抖動
  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
    screenShake *= 0.85;
    if (screenShake < 0.5) screenShake = 0;
  }
  background('#ffddd2'); // 設定背景顏色為陣列中的最後一個顏色：#fb6f92
  // 閃光效果
  if (flashAlpha > 0) {
    fill(255, flashAlpha);
    rect(0, 0, width, height);
    flashAlpha *= 0.8;
    if (flashAlpha < 5) flashAlpha = 0;
  }
  // 音效開關按鈕繪製（放在最上層）
  drawSoundButton();

  // 隨機產生泡泡
  if (random(1) < 0.05) {
    let bubble = {
      x: random(width),
      y: random(height),
      r: random(40, 100),
      life: 240,
      speedY: random(-0.5, -2),
      // 隨機從顏色陣列中選擇一個顏色
      color: random(colors)
    };
    bubbles.push(bubble);
  }

  // 更新並顯示所有泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];
    bubble.y += bubble.speedY;
    bubble.life--;
    let alpha = map(bubble.life, 0, 240, 0, 255);

    // 繪製泡泡主體
    noStroke();
    fill(bubble.color); // 使用泡泡自己的顏色
    ellipse(bubble.x, bubble.y, bubble.r * 2);

    // 繪製星星高光
    let starSize = bubble.r * 0.2;
    let starX = bubble.x + bubble.r * 0.35;
    let starY = bubble.y - bubble.r * 0.35;
    // 高光的顏色固定為最淺的顏色 #ffe5ec，透明度 180
    let c = color(colors[0]);
    c.setAlpha(180);
    fill(c);
    noStroke();
    drawStar(starX, starY, starSize * 0.5, starSize, 5);

    // 當泡泡生命週期結束時，在原地產生爆炸效果
    if (bubble.life < 0 || bubble.y < -bubble.r) {
      explosions.push(new Explosion(bubble.x, bubble.y, bubble.r));
      // 爆炸時觸發閃光與抖動
      screenShake = 4;
      flashAlpha = 180;
      // 爆破音效
      if (soundEnabled && explosionSound && explosionSound.isLoaded()) {
        explosionSound.play();
      }
      bubbles.splice(i, 1);

// 音效開關按鈕繪製



    }
  }
  
  // 更新並顯示所有爆炸效果
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].display();
    if (explosions[i].isFinished()) {
      explosions.splice(i, 1);
    }
  }
}

// 繪製星星的輔助函數
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
function mousePressed() {
  // 檢查是否點擊音效開關按鈕
  if (
    mouseX > soundButtonX && mouseX < soundButtonX + soundButtonW &&
    mouseY > soundButtonY && mouseY < soundButtonY + soundButtonH
  ) {
    soundEnabled = !soundEnabled;
  }
}

function drawSoundButton() {
  push();
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  stroke(180);
  fill(soundEnabled ? '#fb6f92' : '#ccc');
  rect(soundButtonX, soundButtonY, soundButtonW, soundButtonH, 16);
  fill(255);
  noStroke();
  textSize(20);
  text(soundEnabled ? '音效：開啟' : '音效：關閉', soundButtonX + soundButtonW / 2, soundButtonY + soundButtonH / 2);
  pop();
}
// ----------------------------------------------------
// 爆炸效果的類別 (Explosion Class)
// ----------------------------------------------------

class Explosion {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.life = 60;
    let particleCount = int(r * 0.6); // 數量更多

    for (let i = 0; i < particleCount; i++) {
      let angle = random(TWO_PI);
      let speed = random(3, 8); // 更快
      let colorIdx = int(random(colors.length));
      let shapeType = random(["circle", "star"]);
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        size: random(3, 8),
        color: colors[colorIdx],
        shape: shapeType,
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.2, 0.2)
      });
    }
  }

  update() {
    this.life--;
    for (let particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.05;
    }
  }

  display() {
    let alpha = map(this.life, 0, 60, 0, 255);
    for (let particle of this.particles) {
      let pc = color(particle.color);
      pc.setAlpha(alpha);
      fill(pc);
      noStroke();
      if (particle.shape === "circle") {
        ellipse(particle.x, particle.y, particle.size);
      } else {
        push();
        translate(particle.x, particle.y);
        rotate(particle.rotation);
        drawStar(0, 0, particle.size * 0.4, particle.size, 5);
        pop();
        particle.rotation += particle.rotationSpeed;
      }
    }
  }

  isFinished() {
    return this.life < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗大小變動時，按鈕位置也要更新
  soundButtonX = windowWidth - soundButtonW - 32;
  soundButtonY = windowHeight - soundButtonH - 32;
}