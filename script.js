const canvas = document.getElementById("world-canvas")

canvas.width = window.innerWidth     
canvas.height = window.innerHeight

const canvasContext = canvas.getContext('2d')

canvasContext.fillRect(0, 0, canvas.width, canvas.height)

const worldMap = new Image()
worldMap.src = "./images/island-map.png"

worldMap.onload = () => {
  canvasContext.drawImage(worldMap, -1380, -300)
}

