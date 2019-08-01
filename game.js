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
      animate();

      }

    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

var startingScore = 50;
var continueAnimating = false;
var score;

var blockWidth = 125;
var blockHeight = 35;
var block = {
    x: x,
    y: moveCanvas.height - blockHeight,
    width: blockWidth,
    height: blockHeight,
}

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

        var ball = balls[i];

        // test for rock-block collision
        if (isColliding(ball, block)) {
            score -= 10;
            resetBall(ball);
        }

        // advance the rocks
        ball.y += ball.speed;

        // if the rock is below the canvas,
        if (ball.y > moveCanvas.height) {
            resetBall(ball);
        }
      }

// redraw everything
drawAll();

}

function isColliding(a, b) {
    return !(
    b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
}

function drawAll() {

    // clear the canvas
    ctx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);

    let x = gamex;
    let y= gamey;

    var blockWidth = 125;
    var blockHeight = 35;
    var block = {
        x: x,
        y: moveCanvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight,
    }

    //ctx.beginPath();
    //ctx.rect(gamex, 750, 150, 40);
    ctx.beginPath();
    ctx.fillStyle = "rgba(243,201,201,1)";
    ctx.fillRect(block.x, block.y, block.width, block.height);

    // draw all rocks
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        // optionally, drawImage(rocksImg,rock.x,rock.y)
        ctx.fillStyle = "rgba(0,255,0)";
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
    };
});
