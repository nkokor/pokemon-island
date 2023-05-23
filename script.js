const canvas = document.getElementById("world-canvas")

canvas.width = window.innerWidth     
canvas.height = window.innerHeight

const canvasContext = canvas.getContext('2d')

canvasContext.fillRect(0, 0, canvas.width, canvas.height)

const worldMap = new Image()
worldMap.src = "./images/island-map.png"

const player = new Image()
player.src = "./images/player-down.png"

class Sprite {
  constructor({
    position,
    velocity,
    image
  }) {
    this.position = position
    this.image = image
  }

  draw() {
    canvasContext.drawImage(this.image, this.position.x, this.position.y)
  }
}

const background = new Sprite({
  position: {
    x: -1400,
    y: -550
  },
  image: worldMap
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

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  canvasContext.drawImage(player, 
    0,
    0,
    player.width/4,
    player.height,
    canvas.width/2 - 10, canvas.height/2 - 10,
    player.width/4,
    player.height
  )
  if(keys.right.pressed) {
    background.position.x = background.position.x - 4
  } else if(keys.left.pressed) {
    background.position.x = background.position.x + 4
  } else if(keys.up.pressed) {
    background.position.y = background.position.y + 4
  } else if(keys.down.pressed) {
    background.position.y = background.position.y - 4
  }


}

animate()

window.addEventListener("keydown", (event) => {
  if(event.key === "ArrowRight") {
    keys.right.pressed = true
  } else if(event.key === "ArrowLeft" ) {
    keys.left.pressed = true
  } else if(event.key === "ArrowUp") {
    keys.up.pressed = true
  } else if(event.key === "ArrowDown") {
    keys.down.pressed = true
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


