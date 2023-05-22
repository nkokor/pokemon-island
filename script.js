const canvas = document.getElementById("world-canvas")

canvas.width = window.innerWidth     
canvas.height = window.innerHeight

const canvasContext = canvas.getContext('2d')

canvasContext.fillRect(0, 0, canvas.width, canvas.height)

const worldMap = new Image()
worldMap.src = "./images/island-map.png"

const player = new Image()
player.src = "./images/player-down.png"

worldMap.onload = () => {
  canvasContext.drawImage(worldMap, -1400, -550)
  canvasContext.drawImage(player, 
    0,
    0,
    player.width/4,
    player.height,
    canvas.width/2 - 10, canvas.height/2 - 10,
    player.width/4,
    player.height)
}


