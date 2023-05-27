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