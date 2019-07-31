const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

var moveCanvas = document.getElementById("movecanvas");
moveCanvas.style.position = "fixed";
var ctx = moveCanvas.getContext("2d");

moveCanvas.width = window.innerWidth;
moveCanvas.height = window.innerHeight;

var curleft = 0;
var curtop = 0;
var curright;
var curbott;

var gamex;
var gamey;
var x;
var y;

/*var totalBalls = 10;
var balls=[];
for(var i=0;i<totalBalls;i++){
    balls.push({
      "x" : 0,
      "y" : 0
    });
}*/

//let elem = document.getElementById("mybutton");
//var elemRect = elem.getBoundingClientRect();

//var itemRect = item.getBoundingClientRect();

const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.9,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

function runDetection() {
  model.detect(video).then(predictions => {
    console.log("Predictions: ", predictions);
    model.renderPredictions(predictions, canvas, context, video);
    if (predictions[0]) {
      let midvalX = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
      gamex = moveCanvas.width * (midvalX / video.width)
      console.log(midvalX);
      console.log('Predictions: ', gamex);
      let midvalY = predictions[0].bbox[1] + (predictions[0].bbox[3] / 2)
      gamey = moveCanvas.height * (midvalY / video.height)
      console.log(midvalY);
      console.log('Predictions: ', gamey);
      //draw();
      //draw2();
      //scrolling();
      animate();

      }

    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

function scrolling() {
  if (gamey > 500){
    stopScroll();
    startScrollDown();
  }
  else if (gamey < 80){
    stopScroll();
    startScrollUp();
  }
  else if (80 <= gamey <= 500){
    stopScroll();
  };
}

function startScrollDown() {
   scroll = setInterval(function(){ window.scrollBy(0, 10); console.log('start');}, 0.01);

}
function stopScroll() {
   clearInterval(scroll);
}

function startScrollUp() {
  scroll = setInterval(function(){ window.scrollBy(0, -10); console.log('start');}, 0.01);
}

/* function findPos() {
  let elem = document.getElementById("mybutton");
  let elemWidth = elem.offsetWidth;
  let elemHeight = elem.offsetHeight;

  if (elem.offsetParent) {
    do {
        curleft += elem.offsetLeft;
        curtop += elem.offsetTop;
        curright = window.innerWidth - (elem.offsetLeft + elemWidth);
        curbott = window.innerHeight - (elem.offsetTop + elemHeight);
    } while (elem = elem.offsetParent);
    console.log('Left: ' + curleft, 'Top: ' + curtop, 'Right: ' + curright, 'Bottom: ' + curbott);
  }
}*/


/*function drawBall2(ballobj) {
  ballobj.x = Math.random()*(moveCanvas.width);
  ballobj.y = 300;
  ctx.beginPath();
  ctx.arc(ballobj.x, ballobj.y, 10, 0, Math.PI*2);
  ctx.fillStyle = "rgba(243,201,201,1)";
  ctx.fill();
}
function draw2() {
  for(var i=0;i<totalBalls;i++){
    drawBall2(balls[i]);
    resetBall(balls[i]);
  }
}*/

var startingScore = 50;
var continueAnimating = false;
var score;

var ballWidth = 15;
var ballHeight = 15;
var totalBalls = 10;
var balls = [];
for (var i = 0; i < totalBalls; i++) {
    addBall();
}

function addBall() {
    var ball = {
        width: ballWidth,
        height: ballHeight
    }
    resetBall(ball);
    balls.push(ball);
}

function resetBall(ball) {
    ball.x = Math.random() * (moveCanvas.width - ballWidth);
    ball.y = 15 + Math.random() * 30;
    ball.speed = 0.2 + Math.random() * 10;
}

function animate() {

    // request another animation frame

    if (continueAnimating) {
        requestAnimationFrame(animate);
    }

    // for each rock
    // (1) check for collisions
    // (2) advance the rock
    // (3) if the rock falls below the canvas, reset that rock


    for (var i = 0; i < balls.length; i++) {
      console.log('enteringloop');

        var ball = balls[i];

        // test for rock-block collision
        /*if (isColliding(rock, block)) {
            score -= 10;
            resetRock(rock);
        }*/

        // advance the rocks
        ball.y += ball.speed;

        // if the rock is below the canvas,
        /*if (ball.y > moveCanvas.height) {
            resetBall(ball);*/
        }
    // redraw everything
    drawAll();

    /*for (var i = 0; i < balls.length; i++) {
        resetBall(balls[i]);
    }*/

}

function drawAll() {

    // clear the canvas
    ctx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);

    let x = gamex;
    let y = gamey;
    ctx.beginPath();
    ctx.rect(x, 750, 150, 40);
    ctx.fillStyle = "rgba(243,201,201,1)";
    ctx.fill();

    // draw all rocks
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        // optionally, drawImage(rocksImg,rock.x,rock.y)
        ctx.fillStyle = "gray";
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    }
    // draw the score
    /*ctx.font = "14px Times New Roman";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 15);*/
}

// button to start the game
/*$("#start").click(function () {
    score = startingScore
    block.x = 0;
    for (var i = 0; i < rocks.length; i++) {
        resetRock(rocks[i]);
    }
    if (!continueAnimating) {
        continueAnimating = true;
        animate();
    };
});*/


// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    if (updateNote = "Loaded Model") {
      toggleVideo();
      findPos();
    };
});
