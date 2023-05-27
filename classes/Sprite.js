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
    this.frames = {
      ...frames,
      value: 0,
      framesElapsed: 0
    }
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    },
    this.moving = false
  }

  draw() {
    canvasContext.drawImage(this.image, 
      this.frames.value * this.width,
      0,
      this.image.width/this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width/this.frames.max,
      this.image.height
    )
    if(this.moving) {
      if(this.frames.max > 1) {
        this.frames.framesElapsed+=1
      }
      if(this.frames.framesElapsed % 10 == 0) {
        if(this.frames.value + 1 < this.frames.max) {
          this.frames.value += 1
        } else {
          this.frames.value = 0
        }
      }
    }
  }
}
