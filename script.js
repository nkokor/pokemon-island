const canvas = document.getElementById("world-canvas")

canvas.width = window.innerWidth     
canvas.height = window.innerHeight

const canvasContext = canvas.getContext('2d')

const collisionsMap = []
//map dimensions are 70x40
for(let i = 0; i < collisions.length; i = i + 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

class WorldBoundary {
  constructor({
    position
  }) {
    this.position = position
    this.width = 42 // 12 * 3.5 (tile is 12x12, map was exported in 350% zoom)
    this.height = 42
  }
  
  draw() {
    canvasContext.fillStyle = 'red'
    canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const worldBoundaries = []

for(let i = 0; i < collisionsMap.length; i++) {
  for(let j = 0; j < collisionsMap[i].length; j++) {
    if(collisionsMap[i][j] === 1) {
      worldBoundaries.push(new WorldBoundary({
      position: {
        x: j * 42 - 1400,
        y: i * 42 - 550
      }
      })
    )
   }
  }
}

const worldMap = new Image()
worldMap.src = "./images/island-map.png"

const playerImage = new Image()
playerImage.src = "./images/player-down.png"

class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = {
      max: 1
    }
  }) {
    this.position = position
    this.image = image
    this.frames = frames
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
  }

  draw() {
    canvasContext.drawImage(this.image, 
      0,
      0,
      this.image.width/this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width/this.frames.max,
      this.image.height
    )
  }
}

const background = new Sprite({
  position: {
    x: -1400,
    y: -550
  },
  image: worldMap
})

const player = new Sprite({
  position: {
    x:  canvas.width/2 - 192 / 4 / 2,
    y:  canvas.height/2 - 68 / 2,
  },
  image: playerImage,
  frames: {
    max: 4
  }
})

const testBoundary = new WorldBoundary({
  position: {
    x: 400,
    y: 400
  }
})

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  },
  up: {
    pressed: false
  },
  down: {
    pressed: false
  }
}

let lastPressedKey = ''

window.addEventListener("keydown", (event) => {
  if(event.key === "ArrowRight") {
    keys.right.pressed = true
    lastPressedKey = 'r'
  } else if(event.key === "ArrowLeft" ) {
    keys.left.pressed = true
    lastPressedKey = 'l'
  } else if(event.key === "ArrowUp") {
    keys.up.pressed = true
    lastPressedKey = 'u'
  } else if(event.key === "ArrowDown") {
    keys.down.pressed = true
    lastPressedKey = 'd'
  }
})

window.addEventListener("keyup", (event) => {
  if(event.key === "ArrowRight") {
    keys.right.pressed = false
  } else if(event.key === "ArrowLeft" ) {
    keys.left.pressed = false
  } else if(event.key === "ArrowUp") {
    keys.up.pressed = false
  } else if(event.key === "ArrowDown") {
    keys.down.pressed = false
  }
})

const movableObjects = [background, testBoundary]

function move() {
  if(keys.right.pressed && lastPressedKey === 'r') {
    movableObjects.forEach( (m) => {
      m.position.x = m.position.x - 4
    })
    playerImage.src = "./images/player-right.png"
    player.image = playerImage
  } else if(keys.left.pressed && lastPressedKey === 'l') {
    movableObjects.forEach( (m) => {
      m.position.x = m.position.x + 4
    })
    playerImage.src = "./images/player-left.png"
    player.image = playerImage
  } else if(keys.up.pressed && lastPressedKey === 'u') {
    movableObjects.forEach( (m) => {
      m.position.y = m.position.y + 4
    })
    playerImage.src = "./images/player-up.png"
    player.image = playerImage
  } else if(keys.down.pressed && lastPressedKey === 'd') {
    movableObjects.forEach( (m) => {
      m.position.y = m.position.y - 4
    })
    playerImage.src = "./images/player-down.png"
    player.image = playerImage
  }
}

function areInCollision(firstObject, secondObject) {
  return (firstObject.position.x + firstObject.width >= secondObject.position.x
    && firstObject.position.x <= secondObject.position.x + secondObject.width
    && firstObject.position.y <= secondObject.position.y + secondObject.height
    && firstObject.position.y + firstObject.height >= secondObject.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  //for(let i = 0; i < worldBoundaries.length; i++) {
  //  worldBoundaries[i].draw()
  //}
  player.draw()
  testBoundary.draw()

  if(areInCollision(player, testBoundary)) {
    console.log("collision")
  }
  move()
}

animate()




