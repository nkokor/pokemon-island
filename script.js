const canvas = document.getElementById("world-canvas")

canvas.width = 1280     
canvas.height = 720

const canvasContext = canvas.getContext('2d')

const worldMap = new Image()
worldMap.src = "./images/island-map.png"

const playerImage = new Image()
playerImage.src = "./images/player-down.png"

const foregroundMap = new Image()
foregroundMap.src = "./images/foreground-map.png"

const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./images/mountain.jpg"

const pikachuImage = new Image()
pikachuImage.src = "./images/pikachu.png"

const piplupImage = new Image()
piplupImage.src = "./images/piplup.png"

const bulbasaurImage = new Image()
bulbasaurImage.src = "./images/bulbasaur.png"

const rowletImage = new Image()
rowletImage.src = "./images/rowlet.png"

const oshawottImage = new Image()
oshawottImage.src = "./images/oshawott.png"

const charmanderImage = new Image()
charmanderImage.src = "./images/charmander.png"

const squirleImage = new Image()
squirleImage.src = "./images/squirtle.png"

const fennekinImage = new Image()
fennekinImage.src = "./images/fennekin.png"

const background = new Sprite({
  position: {
    x: -1700,
    y: -590
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
    x: -1700,
    y: -590
  },
  image: foregroundMap
})

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

const pikachuNPC = new Sprite({
  position: {
    x: 290,
    y: 250
  },
  image: pikachuImage
})

const piplup = new Sprite({
  position: {
    x: 155,
    y: 155
  },
  image: piplupImage
})

const bulbasaur = new Sprite({
  position: {
    x: -85,
    y: 495
  },
  image: bulbasaurImage
})

const rowlet = new Sprite({
  position: {
    x: -1259,
    y: 750
  },
  image: rowletImage
})

const fennekin = new Sprite({
  position: {
    x: -513,
    y: -135
  },
  image: fennekinImage
})

const oshawott = new Sprite({
  position: {
    x: -289,
    y: -45
  },
  image: oshawottImage
})

const squirle = new Sprite({
  position: {
    x: -937,
    y: -218
  },
  image: squirleImage
})

const charmander = new Sprite({
  position: {
    x: -721,
    y: 155
  },
  image: charmanderImage
})

const collectedPokemons = []

collectedPokemons.push(bulbasaur)
collectedPokemons.push(oshawott)
collectedPokemons.push(rowlet)
collectedPokemons.push(charmander)
collectedPokemons.push(squirle)
collectedPokemons.push(fennekin)
collectedPokemons.push(piplup)

function mapData(data) {
  const map = []
  for(let i = 0; i < data.length; i = i + 70) {
    map.push(data.slice(i, i + 70))
  }
  return map
}

const collisionsMap = mapData(collisionZonesData)

const worldBoundaries = []

for(let i = 0; i < collisionsMap.length; i++) {
  for(let j = 0; j < collisionsMap[i].length; j++) {
    if(collisionsMap[i][j] === 1) {
      worldBoundaries.push(new WorldBoundary({
      position: {
        x: j * 42 - 1700,
        y: i * 42 - 590
      }
      })
    )
   }
  }
}

const battleZonesMap = mapData(battleFieldsData)

const battleFields = []

for(let i = 0; i < battleZonesMap.length; i++) {
  for(let j = 0; j < battleZonesMap[i].length; j++) {
    if(battleZonesMap[i][j] === 1) {
      battleFields.push(new BattleField({
        position: {
          x: j * 42 - 1730,
          y: i * 42 - 615
        }
      }))
    }
  }
}

const battle = {
  activated: false
}

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

const movableObjects = [background, foreground, pikachuNPC]

worldBoundaries.forEach( (b) => {
  movableObjects.push(b)
})

battleFields.forEach( (f) => {
  movableObjects.push(f)
})

collectedPokemons.forEach( (p) => {
  movableObjects.push(p)
})

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  
}

function animateTransition() {
  gsap.to('#transition-animation-div', {
    opacity: 1,
    repeat: 3,
    yoyo: true,
    duration: 0.6,
    onComplete() {
      gsap.to('#transition-animation-div', {
        opacity: 1,
        duration: 0.6,
        onComplete() {
          animateBattle(),
          gsap.to('#transition-animation-div', {
            opacity: 0,
            duration: 0.6
          }),
          battleBackground.draw()
        }
      })
    }
  })
}

function areInCollision(firstObject, secondObject) {
  return (
    firstObject.position.x + firstObject.width >= secondObject.position.x
    && firstObject.position.x <= secondObject.position.x + secondObject.width
    && firstObject.position.y <= secondObject.position.y + secondObject.height
    && firstObject.position.y + firstObject.height >= secondObject.position.y
  )
}

function activateBattle(animation) {
  window.cancelAnimationFrame(animation)
  battle.activated = true
  animateTransition()
}

function handleBattle(animation) {
  for(let i = 0; i < battleFields.length; i++) {
    if(areInCollision(player, battleFields[i]) && Math.random() < 0.05) {
      activateBattle(animation)
      break
    }
  }
}

function setScene() {
  background.draw()
  for(let i = 0; i < worldBoundaries.length; i++) {
    worldBoundaries[i].draw()
  }
  for(let i = 0; i < battleFields.length; i++) {
    battleFields[i].draw()
  }
  pikachuNPC.draw()
  player.draw()

  foreground.draw()
  for(let i = 0; i < collectedPokemons.length; i++) {
    collectedPokemons[i].draw()
  }
}

function animatePlayer() {
  if(keys.right.pressed && lastPressedKey === 'r') {
    player.moving = true
    playerImage.src = "./images/player-right.png"
    player.image = playerImage
  } else if(keys.left.pressed && lastPressedKey === 'l') {
    player.moving = true
    playerImage.src = "./images/player-left.png"
    player.image = playerImage
  } else if(keys.up.pressed && lastPressedKey === 'u') {
    player.moving = true
    playerImage.src = "./images/player-up.png"
    player.image = playerImage
  } else if(keys.down.pressed && lastPressedKey === 'd') {
    player.moving = true
    playerImage.src = "./images/player-down.png"
    player.image = playerImage
  }
}

function move(animation) {
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
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.x = m.position.x - 3
      })
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
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.x = m.position.x + 3
      })
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
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.y = m.position.y + 3
      })
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
        moving = false
        break
      }
    }
    if(moving) {
      movableObjects.forEach( (m) => {
        m.position.y = m.position.y - 3
      })
    }
  }
  if(keys.down.pressed || keys.up.pressed || keys.left.pressed || keys.up.pressed) {
    handleBattle(animation)
  }
}

function animate() {
  let animation = window.requestAnimationFrame(animate)
  if(!battle.activated) {
    setScene()
    animatePlayer()
    move(animation)
  }
}

animate()




