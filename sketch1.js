let title1 = "淡江大學";
let title2 = "教育科技學系";
let bubbles = [];

function setup() { // 設定畫布大小
  createCanvas(windowWidth, windowHeight); // 使用視窗大小
  textSize(48); // 設定文字大小
  textAlign(CENTER, CENTER); // 設定文字置中對齊
  // 設定文字的基線為中心，讓置中更精確
  // textBaseline(CENTER); //
}

function draw() {
  background(0); // 設定背景為黑色

  // 顯示標題
  let title1Y = height / 2 - 50; // 第一行標題的Y座標
  let title2Y = height / 2 + 50;  // 第二行標題的Y座標
  
  // 檢查滑鼠是否在第一行標題附近
  if (isMouseOverText(title1, title1Y)) {
    fill(255, 200, 0); // 鮮豔的橙黃色
    text(title1, width / 2, title1Y); // 顯示第一行標題
    // 產生繞圈文字 (單字一行，速度較慢)
    drawOrbitingLetters(title1, mouseX, mouseY, 70, 0.03); 
  } else {
    fill(255); // 白色文字
    text(title1, width / 2, title1Y);
  }

  // 檢查滑鼠是否在第二行標題附近
  if (isMouseOverText(title2, title2Y)) {
    fill(0, 200, 255); // 鮮豔的藍綠色
    text(title2, width / 2, title2Y);
    // 產生繞圈文字 (單字一行，速度較慢)
    drawOrbitingLetters(title2, mouseX, mouseY, 70, 0.03);
  } else {
    fill(255); // 白色文字
    text(title2, width / 2, title2Y);
  }

  // 隨機產生泡泡
  if (random(1) < 0.05) { // 降低泡泡產生頻率
    let x = random(width);
    let y = random(height);
    let r = random(20, 80);
    let life = 240; // 泡泡的生命週期 (約 4 秒，240 幀)
    bubbles.push(new Bubble(x, y, r, life));
  }

  // 更新並顯示所有泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].display();
    bubbles[i].update();
    if (bubbles[i].isFinished()) {
      bubbles.splice(i, 1);
    }
  }
}

// 判斷滑鼠是否在文字上方的輔助函數
function isMouseOverText(txt, textY) {
  let textW = textWidth(txt);
  return mouseX > width / 2 - textW / 2 && mouseX < width / 2 + textW / 2 &&
         mouseY > textY - textSize() / 2 && mouseY < textY + textSize() / 2;
}

// 繪製環繞單字的函數
function drawOrbitingLetters(txt, centerX, centerY, radius, speed) {
  let angleOffset = frameCount * speed *0.5; // 控制旋轉速度
  for (let i = 0; i < txt.length; i++) {
    let charAngle = angleOffset + (TWO_PI / txt.length) * i; // 計算每個字的獨立角度
    let x = centerX + cos(charAngle) * radius;
    let y = centerY + sin(charAngle) * radius;
    fill(255, 90); // 半透明白色，180代表透明度，再透明點需要改為更低的值
    //文字大小改為更小
    textSize(25); // 調整字體大小
    text(txt.charAt(i), x, y); // 繪製單個字
    textSize(48); // 恢復原本字體大小
  }
}

// 泡泡類別
class Bubble {
  constructor(x, y, r, life) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.life = life;
    this.alpha = 255;
    this.initialY = y; // 記錄初始Y座標
    this.speedY = random(-0.5, -2); // 泡泡向上漂浮的速度
    this.wiggleOffset = random(100); // 左右晃動的偏移量
  }

  update() {
    this.life--;
    this.alpha = map(this.life, 0, this.initialY, 0, 255); // 隨著向上移動逐漸透明
    this.y += this.speedY; // 向上移動
    // 增加左右晃動效果
    this.x += sin(this.y * 0.02 + this.wiggleOffset) * 0.5; 
  }

  display() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    // 繪製兩個同心圓，模擬泡泡厚度感
    ellipse(this.x, this.y, this.r * 2);
    ellipse(this.x, this.y, this.r * 1.8);

    // 模擬泡泡的高光點
    let highlightX = this.x + this.r * 0.4;
    let highlightY = this.y - this.r * 0.4;
    fill(255, 255, 255, this.alpha * 0.8); // 較亮且半透明
    noStroke();
    ellipse(highlightX, highlightY, this.r * 0.3); // 較小的圓形高光
  }

  isFinished() {
    return this.life < 0 || this.y < -this.r; // 超出畫布上方也消失
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}