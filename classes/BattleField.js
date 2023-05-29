class BattleField {
  constructor({
    position
  }) {
    this.position = position
    this.width = 60 // 12 * 3.5 (tile is 12x12, map was exported in 350% zoom)
    this.height = 20
  }
  
  draw() {
    canvasContext.fillStyle = 'rgba(0, 255, 0, 0)'
    canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}