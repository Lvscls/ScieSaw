// Thanks to Renan Martineli for this version of the demo

// setup canvas

var image = document.getElementById("source");
var scie = document.getElementById("scie");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ctx2 = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

document.getElementById("canvas").style.display = "none";

document.getElementById("BestScore").innerHTML =
  localStorage.getItem("BestScore");

//Chronomètre
function chrono() {
  end = new Date();
  diff = end - start;
  diff = new Date(diff);
  var msec = diff.getMilliseconds();
  var sec = diff.getSeconds();
  var min = diff.getMinutes();
  var hr = diff.getHours() - 1;
  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  if (msec < 10) {
    msec = "00" + msec;
  } else if (msec < 100) {
    msec = "0" + msec;
  }
  document.getElementById("chronotime").value =
    hr + ":" + min + ":" + sec + ":" + msec;
  timerID = setTimeout("chrono()", 10);
}
function chronoStart() {
  setTimeout(CreateScie, 1000);
  setInterval(CreateScie, 10000);
  chronoReset();

  document.getElementById("title").style.display = "none";

  start = new Date();
  chrono();
  document.getElementById("start").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  document.body.style.cursor = "none";
  clearTimeout(myTimeout);
  document.getElementById("LeGrosScoreDiv").style.display = "none";
  document.getElementById("LeGrosScore").style.display = "none";
}
function chronoReset() {
  document.getElementById("chronotime").value = "0:00:00:000";
  start = new Date();
}
function chronoStop() {
  location.reload();
  if (
    document.getElementById("chronotime").value >
    document.getElementById("lastScoreInput").value
  ) {
    document.getElementById("lastScoreInput").value =
      document.getElementById("chronotime").value;
  }

  console.log(document.getElementById("chronotime").value);
  clearTimeout(timerID);
}
//Fin

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// function to generate random RGB color value
function randomRGB() {
  return `green`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Scie extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);

    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    /* ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill(); */

    ctx.beginPath();
    ctx.drawImage(scie, this.x, this.y, 35, 47);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const scie of scies) {
      if (!(this === scie) && scie.exists) {
        const dx = this.x - scie.x;
        const dy = this.y - scie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + scie.size) {
          scie.color = this.color = randomRGB();
        }
      }
    }
  }
}

CanvasRenderingContext2D.prototype.clearAll = function () {
  this.save();
  this.setTransform(1, 0, 0, 1, 0, 0);
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.restore();
};

class Arbre extends Shape {
  constructor(x, y) {
    super(x, y, 700, 350);

    this.color = "green";
    this.size = 20;

    window.addEventListener("mousemove", (e) => {
      var relativeX = e.clientX - canvas.offsetLeft;
      var relativeY = e.clientY - canvas.offsetTop;
      if (relativeX > 0 && relativeX < canvas.width) {
        this.x = relativeX - 35 / 2;
      }
      if (relativeY > 0 && relativeY < canvas.width) {
        this.y = relativeY - 35 / 2;
      }
    });
  }

  draw() {
    ctx2.beginPath();
    ctx2.drawImage(image, this.x, this.y, 35, 47);
    ctx2.fill();
    ctx2.closePath();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  collisionDetect() {
    for (const scie of scies) {
      if (scie.exists) {
        const dx = this.x - scie.x;
        const dy = this.y - scie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + scie.size) {
          scie.exists = false;

          DeleteScie();
          document.getElementById("canvas").style.display = "none";

          if (localStorage.getItem("BestScore") != null) {
            if (
              document.getElementById("chronotime").value >
              localStorage.getItem("BestScore")
            ) {
              //Meilleur score
              localStorage.setItem(
                "BestScore",
                document.getElementById("chronotime").value
              );
            }
          } else {
            localStorage.setItem(
              "BestScore",
              document.getElementById("chronotime").value
            );
          }
          document.body.style.cursor = "unset";
          document.getElementById("start").style.display = "block";

          chronoStop();
        }
      }
    }
  }
}

// define array to store scies and populate it

const scies = [];

function CreateScie() {
  for (let i = 0; i < 5; i++) {
    const size = random(10, 20);
    const scie = new Scie(
      // scie position always drawn at least one scie width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );
    scies.push(scie);
  }
}

function DeleteScie() {
  for (let i = 0; i < scies.length; i++) {
    scies[i] = [];
  }
}
const evilScie = new Arbre(random(0, width), random(0, height));

function plop() {
  myTimeout = evilScie.collisionDetect();
}

function loop() {
  var img = document.getElementById("test");

  ctx.fillStyle = ctx.createPattern(img, "repeat");

  ctx.fillRect(0, 0, width, height);

  for (const scie of scies) {
    if (scie.exists) {
      scie.draw();
      scie.update();
      scie.collisionDetect();
    }
  }

  /* background: rgb(181,243,255);
  background: linear-gradient(170deg, rgba(181,243,255,1) 0%, rgba(76,69,199,1) 100%); */

  evilScie.draw();
  evilScie.checkBounds();

  setTimeout(plop, 1500);

  requestAnimationFrame(loop);
}

loop();
