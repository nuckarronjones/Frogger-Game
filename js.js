//////////////////////////////////
//IMPLEMENTATIONS
/*////////////////////////////////

//Functional Implmenentations
-Frog does not move smoothly, instead, teleports lane to lane
-Once a car has passed canvas.height (X), it has a funciton that deletes itself from the lane
and does not get drawn
-Each car has collision detection with player model

//Game Mechanics
-A timer that runs down to zero and if player is alive they win?
  -what do they win?

*/ ////////////////////////////////

const canvasElement = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const Frog = document.getElementById("source");

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function Lane(xPos, laneSpeed) {
  (this.laneXStart = xPos), (this.speed = laneSpeed), (this.cars = []);
}

function Car(x, y, h, w, speed, laneAssigned, id) {
  (this.laneIndex = laneAssigned), //example Traffic.lanes[3]
    (this.id = id),
    (this.x = x),
    (this.y = y),
    (this.h = h),
    (this.w = w),
    (this.speed = speed);
}

//use prototype for object constructor. Each new car inherits this method
Car.prototype.newPos = function () {
  this.y += this.speed;
  this.renderCheck();
};

Car.prototype.playerCollisionCheck = function (Player) {
  if (
    Player.x <= this.x + this.w &&
    Player.x + Player.w >= this.x &&
    Player.y <= this.y + this.h &&
    Player.h + Player.y >= this.y
  ) {
    Player.isAlive = false;
  }
};

//if car goes beyond canvas, it deletes itself from the lane array, thus, not redrawn
Car.prototype.renderCheck = function () {
  if (this.y > Canvas.height) {
    //   console.log(this.x + " has passed threshold")
    //   console.log(Traffic.lanes[this.laneIndex].cars)
    //   Traffic.lanes[this.laneIndex].cars.filter((car)=>{
    //     return this.id != car.id
    //   })

    //   console.log("car removed" + Traffic.lanes[this.laneIndex].length)
    // }
    console.log(
      "Car that has crossed has an id of " +
        this.id +
        ", and Is located in lane " +
        this.laneIndex
    );
    console.log("BEFORE REMOVAL");
    console.log(Traffic.lanes[this.laneIndex].cars);

    Traffic.lanes[this.laneIndex].cars = Traffic.lanes[
      this.laneIndex
    ].cars.filter((car) => {
      return car.id != this.id;
    });

    console.log("AFTER REMOVAL");
    console.log(Traffic.lanes[this.laneIndex].cars);

    //find the lane index, then find the
  }
};

const Traffic = {
  lanes: [],
  makeLanes: function (numberOfLanes) {
    let currentX = Canvas.laneWidth;
    for (let i = 0; i < numberOfLanes; i++) {
      //multiples of a number that is used as a random X starting point for each new car

      //ERROR, CANNOT CHOOSE LANES ALREADY CHOSEN. NEED TO INCREMENT
      let lanePoint = currentX; //Math.round((Math.random()*(Canvas.width-Canvas.laneWidth)+Canvas.laneWidth)/Canvas.laneWidth)*Canvas.laneWidth;
      let randomSpeed = Math.floor(Math.random() * (2 - 1 + 1) + 1); //speed controls
      this.lanes.push(new Lane(lanePoint, randomSpeed));
      currentX += Canvas.laneWidth;
    }
  },
  makeCars: async function () {
    ///////////////////////////////////////////////////DEBUG: add a condition to where cars stop generating and the game is over
    let id = 0;

    while (Player.isAlive) {
      //add timer later

      await sleep(100); //async function has to wait for timing promise to resolve then function continues as normal

      let randomLane = Math.floor(Math.random() * (this.lanes.length - 0) + 0);
      let laneCarsArray = this.lanes[randomLane].cars;
      ///////////////////////////////////////////////////DEBUG: add if statements to calculate previous Y and figure out why random number isnt
      if (
        laneCarsArray.length == 0 ||
        laneCarsArray[laneCarsArray.length - 1].y >= 100
      ) {
        //check if a lane is empty, or a car has already passed onto canvas to make a new car. If not, randomize a new lane

        let laneStart = this.lanes[randomLane].laneXStart;
        let speed = this.lanes[randomLane].speed;

        //ID, and the index of what lane the car is in, is used in the renderCheck to detect out of bounds. Car deletes itself from the array if it leaves canvas (no longer drawn)
        let car = new Car(
          laneStart,
          -100,
          100,
          Canvas.laneWidth,
          speed,
          randomLane,
          id
        );

        this.lanes[randomLane].cars.push(car);

        laneFound = true;

        id++;
      }
    }
  },
  drawCars: function () {
    this.lanes.forEach((lane) => {
      lane.cars.forEach((car) => {
        ctx.fillRect(car.x, car.y, car.w, car.h);
        car.playerCollisionCheck(Player);
      });
    });
  },

  updateCars: function () {
    this.lanes.forEach((lane) => {
      lane.cars.forEach((car) => {
        car.newPos();
      });
    });
  },
};

const Canvas = {
  numberOfLanes: 10,
  width: canvasElement.width,
  height: canvasElement.height,
  get laneWidth() {
    //use getter as object literals cant use 'this' like in constructors
    return this.width / this.numberOfLanes;
  },
  update: function () {
    Canvas.clear();
    Canvas.drawCanvas();

    Traffic.drawCars();
    Player.drawPlayer();

    Traffic.updateCars();
    Player.newPos();

    if (Player.isAlive) {
      requestAnimationFrame(Canvas.update);
    }
  },
  drawCanvas: function () {
    for (let i = this.width; i > 0; i -= this.laneWidth) {
      ctx.setLineDash([6]);
      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);
      ctx.stroke();
    }
  },
  clear: function () {
    ctx.clearRect(0, 0, this.width, this.height);
  },
  resetGame: function () {
    Traffic.lanes = []
  },
};

const eventListeners = {
  keyDown: function (e) {
    if (e.key == "ArrowRight" || e.key == "Right") {
      Player.moveRight();
    } else if (e.key == "ArrowLeft" || e.key == "Left") {
      Player.moveLeft();
    }
  },
  keyUp: function () {
    Player.dy = 0;
    Player.dx = 0;
  },
};

const Player = {
  x: 200,
  y: 400 - 25,
  w: 25,
  h: 25,
  dx: 0,
  dy: 0,
  speed: 4,
  isAlive: true,
  drawPlayer: function () {
    ctx.drawImage(Frog, this.x, this.y, this.w, this.h);
  },
  moveLeft: function () {
    this.dx = -this.speed;
  },
  moveRight: function () {
    this.dx = +this.speed;
  },
  newPos: function () {
    this.x += this.dx;
    this.y += this.dy;
    this.collisionDetection();
  },
  collisionDetection: function () {
    if (this.x > canvasElement.width - this.w) {
      this.x = canvasElement.width - this.w;
    }
    if (this.x < 0) {
      this.x = 0;
    }
  },
};

Traffic.makeLanes(Canvas.numberOfLanes);
Traffic.makeCars();
Canvas.update();

document.addEventListener("keydown", eventListeners.keyDown);
document.addEventListener("keyup", eventListeners.keyUp);
