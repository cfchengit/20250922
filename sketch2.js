let title1 = "淡江大學";
let title2 = "教育科技學系";
let bubbles = []; // 儲存泡泡資料的陣列

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(48);
  textAlign(CENTER, CENTER);
  // textBaseline(CENTER); // 註解或移除，避免舊版函式庫錯誤
}

function draw() {
  background(0); // 設定背景為黑色

  // 顯示標題
  let title1Y = height / 2 - 50;
  let title2Y = height / 2 + 50;
  
  // 檢查滑鼠是否在第一行標題附近
  if (isMouseOverText(title1, title1Y)) {
    fill(255, 200, 0); // 鮮豔的橙黃色
    text(title1, width / 2, title1Y);
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
  if (random(1) < 0.03) { // 降低泡泡產生頻率
    // 每個泡泡用一個物件來儲存它的所有屬性
    let bubble = {
      x: random(width),
      y: random(height),
      r: random(20, 80),
      life: 240, // 泡泡的生命週期
      speedY: random(-0.5, -2) // 向上漂浮的速度
    };
    bubbles.push(bubble);
  }

  // 更新並顯示所有泡泡
  // 從後往前迴圈可以安全地刪除陣列元素
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];

    // 更新泡泡的狀態
    bubble.y += bubble.speedY; // 向上移動
    bubble.life--; // 生命週期減少
    
    // 根據生命週期計算透明度
    let alpha = map(bubble.life, 0, 240, 0, 255);

    // 繪製泡泡
    noFill();
    stroke(255, alpha);
    strokeWeight(2);
    ellipse(bubble.x, bubble.y, bubble.r); // 簡單的圓圈

    // 繪製高光點 (簡單的方形)
    let highlightSize = bubble.r * 0.2;
    fill(255, alpha * 0.8);
    noStroke();
    rect(bubble.x + bubble.r * 0.2, bubble.y - bubble.r * 0.2, highlightSize, highlightSize);

    // 判斷泡泡是否需要被刪除
    if (bubble.life < 0 || bubble.y < -bubble.r) {
      bubbles.splice(i, 1); // 刪除生命週期結束的泡泡
    }
  }
}

// 判斷滑鼠是否在文字上方的輔助函數
function isMouseOverText(txt, textY) {
  let textW = textWidth(txt);
  // 假設文字高度為textSize()
  return mouseX > width / 2 - textW / 2 && mouseX < width / 2 + textW / 2 &&
         mouseY > textY - 24 && mouseY < textY + 24;
}

// 繪製環繞單字的函數
function drawOrbitingLetters(txt, centerX, centerY, radius, speed) {
  let angleOffset = frameCount * speed;
  for (let i = 0; i < txt.length; i++) {
    let charAngle = angleOffset + (TWO_PI / txt.length) * i;
    let x = centerX + cos(charAngle) * radius;
    let y = centerY + sin(charAngle) * radius;
    fill(255, 180); // 半透明白色
    text(txt.charAt(i), x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}