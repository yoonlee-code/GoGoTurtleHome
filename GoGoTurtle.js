let turtles = [];
let finishLine;
let selectedTurtle = null;
let raceStarted = false;
let result = "";
let turtleImages = [];
let shells = 5; // Initial shell count

function preload() {
  // Load turtle images
  turtleImages = [
    loadImage('turtle1.png'),
    loadImage('turtle2.png'),
    loadImage('turtle3.png')
  ];
}

function setup() {
  createCanvas(600, 400);

  finishLine = width - 50;

  for (let i = 0; i < 3; i++) {
    turtles.push({
      x: 50,
      y: 0, // Initial y position; will be updated dynamically in draw()
      speed: random(1, 3),
    });
  }

  let instruction = createP("Click on a turtle to select your bet.");
  instruction.style('color', 'white'); // Set text color to white

  let startButton = createButton("Start Race");
  startButton.mousePressed(startRace);

  let playAgainButton = createButton("Play Again");
  playAgainButton.mousePressed(resetGame);
  playAgainButton.hide();
  playAgainButton.id('playAgain');
}

function draw() {
  // Set background color to grass green
  background(124, 200, 0);

  // Draw track lanes
  stroke(255); // White lines for track lanes
  strokeWeight(2); // Thicker lines
  let trackHeight = height / 3;
  line(0, trackHeight, width, trackHeight); // Top lane line
  line(0, 2 * trackHeight, width, 2 * trackHeight); // Bottom lane line

  // Draw finish line (thicker)
  stroke(100, 100, 100);
  strokeWeight(4);
  line(finishLine, 0, finishLine, height);

  // Draw turtles positioned in the center of each track
  for (let i = 0; i < turtles.length; i++) {
    let laneCenter = trackHeight * i + trackHeight / 2; // Center of each lane
    turtles[i].y = laneCenter; // Update turtle's y-position to stay in lane
    image(turtleImages[i], turtles[i].x, turtles[i].y - 35, 80, 70); // Larger turtle images
    if (!raceStarted && selectedTurtle === i) {
      stroke(255, 100, 100);
      noFill();
      rect(turtles[i].x - 5, turtles[i].y - 40, 90, 80); // Highlight selected turtle
    }
  }

  // Display shell count
  textSize(20);
  fill(0);
  textAlign(LEFT);
  text(`Shells: ${shells}`, 10, 20);

  // Display race result
  textAlign(CENTER);
  text(result, width / 2, height - 20);

  // Race logic
  if (raceStarted) {
    let finished = false;

    for (let i = 0; i < turtles.length; i++) {
      let turtle = turtles[i];

      // Adjust speeds based on the round and probability
      if (selectedTurtle === i) {
        // Increase speed for selected turtle
        turtle.x += turtle.speed + random(1, 2);
      } else {
        // Normal speed for non-selected turtles
        turtle.x += turtle.speed + random(0.5, 1);
      }

      // Check if any turtle crosses the finish line
      if (turtle.x >= finishLine) {
        finished = true;
      }
    }

    // Stop the race when a turtle crosses the finish line
    if (finished) {
      raceStarted = false;
      checkWinner();
      document.getElementById('playAgain').style.display = 'inline-block';
    }
  }
}

function mousePressed() {
  if (raceStarted) return;

  for (let i = 0; i < turtles.length; i++) {
    let turtle = turtles[i];
    if (
      mouseX > turtle.x &&
      mouseX < turtle.x + 80 &&
      mouseY > turtle.y - 35 &&
      mouseY < turtle.y + 35
    ) {
      selectedTurtle = i;
      result = `You selected Turtle ${i + 1}!`; // Display the 1-based turtle number
    }
  }
}

function startRace() {
  if (raceStarted || selectedTurtle === null) {
    result = "Please select a turtle before starting the race!";
    return;
  }

  if (shells <= 0) {
    result = "No shells left! You can't play.";
    return;
  }

  // Deduct a shell
  shells--;

  // Reset positions
  for (let turtle of turtles) {
    turtle.x = 50;
    turtle.speed = random(1, 3);
  }

  raceStarted = true;
  result = "";
}

function checkWinner() {
  let winnerIndex = 0;
  let maxDistance = 0;

  // Determine the leading turtle
  for (let i = 0; i < turtles.length; i++) {
    if (turtles[i].x > maxDistance) {
      maxDistance = turtles[i].x;
      winnerIndex = i;
    }
  }

  // Set the race result using 1-based turtle numbers
  result = `Turtle ${winnerIndex + 1} wins! `;
  if (selectedTurtle === winnerIndex) {
    result += "Jackpot!";
    shells += 2; // Award 2 shells for winning
  } else {
    result += "Better Luck Next Time!";
  }
}

function resetGame() {
  // Reset game state
  for (let turtle of turtles) {
    turtle.x = 50;
    turtle.speed = random(1, 3);
  }

  selectedTurtle = null;
  raceStarted = false;

  result = "Click on a turtle to select your bet.";
  document.getElementById('playAgain').style.display = 'none';
}