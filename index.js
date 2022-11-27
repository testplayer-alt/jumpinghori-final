var canvas, g;
var canvas_back, g_back;
var backgroundimage, backgroundPosX, backgroundPosY;
var characterPosX, characterPosY, characterimage;
var speed, acceleration;
var enemyPosX, enemyPosY, enemyimage;
var score;
var jump = true;
var gameover_sound = true;
var gameovercoment2 = false;
var scoreLabelWidth;
var playerR, enemyR;
var enemyspeed;
var scene;
var frameCount;
var gamemain_bgm = false;
const Scenes = {
  gametitle: "GameTitle",
  gamemain: "GameMain",
  gameover: "GameOver",
};

window.addEventListener('DOMContentLoaded', function bgmstart(){
  const slider_volume = document.getElementById("volume");
  const audioElement = document.querySelector("audio");
  // ボリュームの初期設定
  audioElement.volume = slider_volume.value;
  audioElement.play();
  slider_volume.addEventListener("input", e => {
    audioElement.volume = slider_volume.value;
  });
});

//音量調節機能作成中

////サイト接続時のパスワード入力
//let master = "2525";
//let word = "";
//let number ="0123456789";
//for (let o = 0; o < 4; o++) {
//    word += number[Math.floor(Math.random() * number.length)];
//}
//console.log(word);
//
//let i = 0;
//do{
//    let pas = prompt('パスワードを入力してください');
//    if(pas == word || pas == master) {
//        i = i+1;
//    } else {
//        alert("パスワードが違います");
//    }
//}while(i == 0)
//
onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  canvas_back = document.getElementById("gamecanvas-back");
  g_back = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown();
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function audio() {
  var jumpsound = document.getElementById("btn_audio");
  jumpsound.currentTime = 0; //連続クリックに対応
  jumpsound.play(); //クリックしたら音を再生
}
function gameoveraudio() {
  document.getElementById('gameover').play();
  setTimeout('document.getElementById("gameover2").play();', 3000);
  setTimeout('gameovercoment2 = true;', 3000);
}
//function bgm() {
//  document.getElementById('BGM').play();
//}

function init() {

  //ゲーム管理データ初期化
  score = 0;
  scene = Scenes.gametitle;

  //背景描画
  backgroundPosX = 250;
  backgroundPosY = 100;
  backgroundimage = new Image
  backgroundimage.src = "./abc.png";

  characterPosX = 100;
  characterPosY = 400;
  characterimage = new Image();
  characterimage.src = "./hori.png";
  playerR = 25;

  enemyPosX = 1000;
  enemyPosY = 400;
  enemyimage = new Image();
  enemyimage.src = "./akio.png";
  enemyR = 25;
  enemyspeed = 10;
}

function keydown(e) {
  if(scene == Scenes.gameover){
    return;
  }if(jump) {
    speed = -20;
    acceleration = 1.5;
    audio();
    jump = false;
  }
}
addEventListener("keydown", keydown);
addEventListener("keydown", title);
  function title(e) {
    if(scene == Scenes.gametitle){
      scene = Scenes.gamemain;
    }
  }

function gameloop() {
  update();
  draw();
}

function update() {
  if(scene == Scenes.gametitle) {
    return;
  } else if(scene == Scenes.gamemain){
    gamemain_bgm = true;
    //if(gamemain_bgm){
    //  bgm();
    //
    speed = speed + acceleration;
    characterPosY = characterPosY + speed;
    enemyPosX -= enemyspeed;
    if(enemyPosX < -15) {
      enemyPosX = 500;
      score = score + 10;
    }
    if (characterPosY > 400) {
      characterPosY = 400;
      speed = 0;
      acceleration = 0;
      jump = true;
    }
    //当たり判定
    var diffX = characterPosX - enemyPosX;
    var diffY = characterPosY - enemyPosY;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if(distance < playerR + enemyR) {
      scene = Scenes.gameover;
      speed = -18;
      acceleration = 0.5;
      frameCount = 0;
    }
  }else if(scene == Scenes.gameover) {
    //gameover
    gamemain_bgm = false;
    speed = speed + acceleration;
    characterPosY = characterPosY + speed;
    enemyPosX -= enemyspeed;
    if(gameover_sound){
      gameoveraudio();
      gameover_sound = false;
    }
  }
}


function draw() {


  g_back.drawImage(backgroundimage,0, 0, 480, 480);

  g.fillStyle = "rgb(0,0,0)";
  g.font = "25pt Arial";
  var scoreLabel = "SCORE :  " + score;
  scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, 300 - scoreLabelWidth, 50);

  //gameover
  if(scene == Scenes.gameover){
    g.fillStyle = "rgb(0,0,0)";
    g.font = "70px Arial";
    var gameovercoment = "GAME OVER";
    var gameovercomentWidth = g.measureText(gameovercoment).width;
    g.fillText(gameovercoment, 450 - gameovercomentWidth, 200);
    if(gameovercoment2){
      g.fillStyle = "rgb(0,0,0)";
      g.font = "25px Arial";
      var gameovercoment = "堀はあきおに殺されてしまった!";
      var gameovercomentWidth = g.measureText(gameovercoment).width;
      g.fillText(gameovercoment, 410 - gameovercomentWidth, 250);
    }
  }else if(scene == Scenes.gametitle){
    g.fillStyle = "rgb(0,0,0)";
    g.font = "30px Arial";
    var gameovercoment = "キーを押すとゲームが始まります";
    var gameovercomentWidth = g.measureText(gameovercoment).width;
    g.fillText(gameovercoment, 465 - gameovercomentWidth, 235);
  }
  
  g.drawImage(
    characterimage,
    characterPosX - characterimage.width / 2,
    characterPosY - characterimage.height / 2
  );
  g.drawImage(
    enemyimage,
    enemyPosX - enemyimage.width / 2,
    enemyPosY - enemyimage.height / 2
  );


  
}