var canvas, g;
var canvas_back, g_back;
var score;
var jump = true;
var gameover_sound = true;
var gameovercoment2 = false;
var restart = false;
var aimode = false;
var randomspeed;
var scoreLabelWidth;
var player,enemy;
var scene;
var frameCount;
var particles;
var gamemain_bgm = false;
var nmode, hmode;
const Scenes = {
  gametitle: "GameTitle",
  gamemain: "GameMain",
  gamemain_h: "GameMain_h",
  gameover: "GameOver",
};
function reload() {
  window.location.reload();
}


//音量調節機能作成中
//enemyをランダムスポーンにするためclass制作


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
  setTimeout('restart = true;', 3000);
}

function init() {

  //ゲーム管理データ初期化
  score = 0;
  scene = Scenes.gametitle;
  particles = [];
  randomspeed = true;
  nmode = false;
  hmode = false;

  //背景描画
  backgroundPosX = 250;
  backgroundPosY = 100;
  backgroundimage = new Image
  backgroundimage.src = "./abc.png";

  //キャラ初期化
  player = new Sprite();
  player.posx = 100;
  player.posy = 400;
  player.r = 25;
  player.image = new Image();
  player.image.src = "./chara0.png";
  player.speed = 0;
  player.acceleration = 0;

  enemy = new Sprite();
  enemy.posx = 600;
  enemy.posy = 400;
  enemy.r = 25;
  enemy.image = new Image();
  enemy.image.src = "./enemyimage0.png";
  enemy.speed = 0;
  enemy.acceleration = 0;
}
//AImode
function AImodeon(){
  aimode = true;
}
//ノーマルモード
function nomalmode(){
  nmode = true;
  if(hmode) {
    hmode = false;
  }
}
//ハードモード
function heardmode(){
  hmode = true;
  if(nmode) {
    nmode = false;
  }
}


function keydown(e) {
  if(jump) {
    player.speed = -20;
    player.acceleration = 1.5;
    audio();
    jump = false;
  }
}
function restarto() {
  if(scene == Scenes.gameover){
    if(restart){
      reload()
    }
    }
}
addEventListener("keydown", restarto);
addEventListener("keydown", keydown);
addEventListener("keydown", title);
  function title(e) {
    if(scene == Scenes.gametitle){
      if(nmode){
        scene = Scenes.gamemain;
      }if(hmode){
        scene = Scenes.gamemain_h;
      }
    }
  }

function gameloop() {
  update();
  draw();
}

function update() {
  if(scene == Scenes.gametitle) {
    return;
  } else if(scene == Scenes.gamemain || scene == Scenes.gamemain_h){
    gamemain_bgm = true;
    player.speed = player.speed + player.acceleration;
    player.posy = player.posy + player.speed;
    enemy.posx -= enemy.speed;
    if(enemy.posx < -15) {
      enemy.posx = 500;
      score = score + 10;
      randomspeed = true;
    }
    if (player.posy > 400) {
      player.posy = 400;
      player.speed = 0;
      player.acceleration = 0;
      jump = true;
    }
    //ノーマルモード
    if(score >= 0 && score < 300 && scene == Scenes.gamemain) {
      enemy.speed = 12;
    }if(score > 300 && score < 600 && scene == Scenes.gamemain){
      enemy.speed = 15;
    }if(score >= 600 && scene == Scenes.gamemain){
      enemy.speed = 18;
    }




    //ハードモード
    if(score >= 0 && score < 300 && scene == Scenes.gamemain_h) {
      if(randomspeed){
        var random_easy = Math.floor(Math.random() * 7) + 8;
        enemy.speed = random_easy;
        randomspeed = false;
        console.log(enemy.speed);
      }
    }if(score > 300 && score < 600 && scene == Scenes.gamemain_h) {
      if(randomspeed){
        var random_nomal = Math.floor(Math.random() * 10) + 8;
        enemy.speed = random_nomal;
        randomspeed = false;
        console.log(enemy.speed);
      }
    }if(score >= 600 && scene == Scenes.gamemain_h) {
      if(randomspeed){
        var random_heard = Math.floor(Math.random() * 7) + 12;
        enemy.speed = random_heard;
        randomspeed = false;
        console.log(enemy.speed);        
      }

    }
    
    //当たり判定
    var diffX = player.posx - enemy.posx;
    var diffY = player.posy - enemy.posy;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if(aimode && distance < 100){
      keydown();
    }else if(distance < player.r + enemy.r) {
      scene = Scenes.gameover;
      player.speed = -18;
      player.acceleration = 0.5;
      frameCount = 0;
      for(var i = 0; i < 100; i ++) {
        particles.push(new Particle(player.posx, player.posy));
      }
      
    }
  }else if(scene == Scenes.gameover) {
    //gameover
    jump = false;
    gamemain_bgm = false;
    player.speed = player.speed + player.acceleration;
    player.posy = player.posy + player.speed;
    enemy.posx -= enemy.speed;
    if(gameover_sound){
      gameoveraudio();
      gameover_sound = false;
    }
    particles.forEach((p) => {
      p.update();
    });
  }
}


function draw() {


  g_back.drawImage(backgroundimage,0, 0, 480, 480);
  if(scene == Scenes.gamemain || scene == Scenes.gamemain_h){
    g.fillStyle = "rgb(0,0,0)";
    g.font = "25pt Arial";
    var scoreLabel = "SCORE :  " + score;
    scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 450 - scoreLabelWidth, 50);
  }


  //gameover
  if(scene == Scenes.gameover){
    g.fillStyle = "rgb(0,0,0)";
    g.font = "70px Arial";
    var gameovercoment = "GAME OVER";
    var gameovercomentWidth = g.measureText(gameovercoment).width;
    g.fillText(gameovercoment, 450 - gameovercomentWidth, 200);
    particles.forEach((p) => {
      p.draw(g);
    });
    if(gameovercoment2){
      g.fillStyle = "rgb(0,0,0)";
      g.font = "25px Arial";
      var gameovercoment = "やられてしまった!";
      var gameovercomentWidth = g.measureText(gameovercoment).width;
      g.fillText(gameovercoment, 345 - gameovercomentWidth, 250);
      //最終スコア
      g.fillStyle = "rgb(0,0,0)";
      g.font = "25px Arial";
      var gameovercoment = "FINALSCORE : " + score;
      var gameovercomentWidth = g.measureText(gameovercoment).width;
      g.fillText(gameovercoment, 340 - gameovercomentWidth, 290);
      //restart
      g.fillStyle = "rgb(0,0,0)";
      g.font = "15px Arial";
      var gameovercoment = "次のゲームを始めるには何かキーを押してください";
      var gameovercomentWidth = g.measureText(gameovercoment).width;
      g.fillText(gameovercoment, 400 - gameovercomentWidth, 350);
    }
  }else if(scene == Scenes.gametitle){
    g.fillStyle = "rgb(0,0,0)";
    g.font = "30px Arial";
    var gameovercoment = "キーを押すとゲームが始まります";
    var gameovercomentWidth = g.measureText(gameovercoment).width;
    g.fillText(gameovercoment, 465 - gameovercomentWidth, 235);
  }
  
  player.draw(g);

  enemy.draw(g);
}

class Sprite {
  image = null;
  posy = 0;
  posy = 0;
  speed = 0;
  acceleration = 0;
  r = 0;

  //キャラ描画
  draw(g) {
    g.drawImage(
      this.image,
      this.posx - this.image.width / 2,
      this.posy - this.image.height / 2
    );
  }
}
//パーティクル
class Particle extends Sprite {
  baseLine = 0;
  acceleration = 0;
  speedy = 0;
  speedx = 0;

  constructor(x, y) {
    super();
    this.posx = x,
    this.posy = y,
    this.baseLine = 420;
    this.acceleration = 0.5;
    var angle = (Math.PI * 5) / 4 + (Math.PI / 2) * Math.random();
    this.speed = 5 + Math.random() * 20;
    this.speedx = this.speed * Math.cos(angle);
    this.speedx = this.speed * Math.sin(angle);
    this.r = 2;
  }
  update() {
    this.speedx *= 0.97;
    this.speedy += this.acceleration;
    this.posx += this.speedx;
    this.posy += this.speedy;
    if (this.posy > this.baseLine) {
      this.posy = this.baseLine;
      this.speedy = this.speedy * -1 * (Math.random() * 0.5 + 0.3);
    }
  }
  
  draw(g) {
    g.fillStyle = "rgb(255,50,50)";
    g.fillRect(this.posx - this.r, this.posy - this.r, this.r * 2, this.r * 2);
  }
}

