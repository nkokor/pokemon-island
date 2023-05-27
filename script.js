const canvas = document.getElementById("world-canvas")

canvas.width = window.innerWidth     
canvas.height = window.innerHeight

const canvasContext = canvas.getContext('2d')

const collisionsMap = []
//map dimensions are 70x40
for(let i = 0; i < collisions.length; i = i + 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
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

const battleZonesMap = []

for(let i = 0; i < battleZones.length; i = i + 70) {
  battleZonesMap.push(battleZones.slice(i, i + 70))
}

const battleFields = []

for(let i = 0; i < battleZonesMap.length; i++) {
  for(let j = 0; j < battleZonesMap[i].length; j++) {
    if(battleZonesMap[i][j] === 1) {
      battleFields.push(new BattleField({
        position: {
          x: j * 42 - 1400,
          y: i * 42 - 550
        }
      }))
    }
  }
}

const worldMap = new Image()
worldMap.src = "./images/island-map.png"

const playerImage = new Image()
playerImage.src = "./images/player-down.png"

const foregroundMap = new Image()
foregroundMap.src = "./images/foreground-map.png"


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
    player.moving = true
  } else if(event.key === "ArrowLeft" ) {
    keys.left.pressed = true
    lastPressedKey = 'l'
    player.moving = true
  } else if(event.key === "ArrowUp") {
    keys.up.pressed = true
    lastPressedKey = 'u'
    player.moving = true
  } else if(event.key === "ArrowDown") {
    keys.down.pressed = true
    lastPressedKey = 'd'
    player.moving = true
  }
})

window.addEventListener("keyup", (event) => {
  if(event.key === "ArrowRight") {
    keys.right.pressed = false
    player.moving = false
  } else if(event.key === "ArrowLeft" ) {
    keys.left.pressed = false
    player.moving = false
  } else if(event.key === "ArrowUp") {
    keys.up.pressed = false
    player.moving = false
  } else if(event.key === "ArrowDown") {
    keys.down.pressed = false
    player.moving = false
  }
})

const movableObjects = [background, foreground]

worldBoundaries.forEach( (b) => {
  movableObjects.push(b)
})

battleFields.forEach( (f) => {
  movableObjects.push(f)
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
  for(let i = 0; i < worldBoundaries.length; i++) {
    worldBoundaries[i].draw()
  }
  for(let i = 0; i < battleFields.length; i++) {
    battleFields[i].draw()
  }
  player.draw()
  foreground.draw()

  worldBoundaries.forEach( (b) => {
    if(areInCollision(player, b)) {
      console.log("collision")
    }
  })
  move()
}

animate()




