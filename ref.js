// game variables
var startingScore = 50;
var continueAnimating = false;
var score;
score = startingScore;

// block variables
var blockWidth = 125;
var blockHeight = 35;
var block = {
    x: 0,
    y: moveCanvas.height - blockHeight,
    width: blockWidth,
    height: blockHeight,
}

// ball variables
var ballWidth = 15;
var ballHeight = 15;
var totalballs = 10;
var balls = [];
for (var i = 0; i < totalballs; i++) {
    addball();
}

function addball() {
    var ball = {
        width: ballWidth,
        height: ballHeight
    }
    resetball(ball);
    balls.push(ball);
}

// move the ball to a random position near the top-of-moveCanvas
// assign the ball a random speed
function resetball(ball) {
    ball.x = Math.random() * (moveCanvas.width - ballWidth);
    ball.y = 15 + Math.random() * 30;
    ball.speed = 0.2 + Math.random() * 0.5;
}

function animate() {

    // request another animation frame

    if (continueAnimating) {
        requestAnimationFrame(animate);
    }

    // for each ball
    // (1) check for collisions
    // (2) advance the ball
    // (3) if the ball falls below the moveCanvas, reset that ball

    for (var i = 0; i < balls.length; i++) {

        var ball = balls[i];

        // test for ball-block collision
        if (isColliding(ball, block)) {
            score -= 10;
            console.log('ENTER');
            console.log('ENTER');
            console.log('ENTER');
            console.log('ENTER');
            console.log('ENTER');
            resetball(ball);
        }

        // advance the balls
        ball.y += ball.speed;

        // if the ball is below the moveCanvas,
        if (ball.y > moveCanvas.height) {
            resetball(ball);
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

    // clear the moveCanvas
    ctx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);

      let x = gamex;
      let y = gamey;

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

    // draw all balls
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        // optionally, drawImage(ballsImg,ball.x,ball.y)
        ctx.fillStyle = "rgba(0,255,0)";
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    // draw the score
    ctx.font = "14px Times New Roman";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 15);
}
