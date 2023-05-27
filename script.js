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
    canvasContext.fillStyle = 'rgba(255, 0, 0, 0)'
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

const foregroundMap = new Image()
foregroundMap.src = "./images/foreground-map.png"

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

const foreground = new Sprite({
  position: {
    x: -1400,
    y: -550
  },
  image: foregroundMap
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

const movableObjects = [background, foreground]

worldBoundaries.forEach( (b) => {
  movableObjects.push(b)
})

function move() {
  let moving = true
  if(keys.right.pressed && lastPressedKey === 'r') {
    for(let i = 0; i < worldBoundaries.length; i++) {
      if(areInCollision(player, {
        //deep copy
        ...worldBoundaries[i],
        position: {
        x: worldBoundaries[i].position.x - 3,
        y: worldBoundaries[i].position.y
      }})){
        console.log("collision")
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.x = m.position.x - 3
      })
      playerImage.src = "./images/player-right.png"
      player.image = playerImage
    }
  } else if(keys.left.pressed && lastPressedKey === 'l') {
    for(let i = 0; i < worldBoundaries.length; i++) {
      if(areInCollision(player, {
        //deep copy
        ...worldBoundaries[i],
        position: {
        x: worldBoundaries[i].position.x + 3,
        y: worldBoundaries[i].position.y
      }})){
        console.log("collision")
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.x = m.position.x + 3
      })
      playerImage.src = "./images/player-left.png"
      player.image = playerImage
    }
  } else if(keys.up.pressed && lastPressedKey === 'u') {
    for(let i = 0; i < worldBoundaries.length; i++) {
      if(areInCollision(player, {
        //deep copy
        ...worldBoundaries[i],
        position: {
        x: worldBoundaries[i].position.x,
        y: worldBoundaries[i].position.y + 3
      }})){
        console.log("collision")
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.y = m.position.y + 3
      })
      playerImage.src = "./images/player-up.png"
      player.image = playerImage
    }
  } else if(keys.down.pressed && lastPressedKey === 'd') {
    for(let i = 0; i < worldBoundaries.length; i++) {
      if(areInCollision(player, {
        //deep copy
        ...worldBoundaries[i],
        position: {
        x: worldBoundaries[i].position.x,
        y: worldBoundaries[i].position.y - 3
      }})){
        console.log("collision")
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.y = m.position.y - 3
      })
      playerImage.src = "./images/player-down.png"
      player.image = playerImage
    }
  }
}

function areInCollision(firstObject, secondObject) {
  return (
    firstObject.position.x + firstObject.width >= secondObject.position.x
    && firstObject.position.x <= secondObject.position.x + secondObject.width
    && firstObject.position.y <= secondObject.position.y + secondObject.height
    && firstObject.position.y + firstObject.height >= secondObject.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  player.draw()
  for(let i = 0; i < worldBoundaries.length; i++) {
    worldBoundaries[i].draw()
  }
  foreground.draw()

  worldBoundaries.forEach( (b) => {
    if(areInCollision(player, b)) {
      console.log("collision")
    }
  })
  move()
}

animate()




