import React from 'react'
import axios from 'axios'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleOff = this.handleOff.bind(this)
    this.canvas = null
    this.ctx = null
    this.isDrawing = false
    this.x = 0
    this.y = 0
    this.drawLine = this.drawLine.bind(this)
  }

  async componentDidMount() {
    const canvas = document.getElementById('my-canvas')
    this.canvas = canvas
    this.ctx = await canvas.getContext('2d')
    this.canvas.addEventListener('mousedown', e => {
      this.x = e.offsetX
      this.y = e.offsetY
      this.isDrawing = true
    })

    this.canvas.addEventListener('mousemove', e => {
      if (this.isDrawing === true) {
        this.drawLine(this.ctx, this.x, this.y, e.offsetX, e.offsetY)
        this.x = e.offsetX
        this.y = e.offsetY
      }
    })

    window.addEventListener('mouseup', async e => {
      if (this.isDrawing === true) {
        this.drawLine(this.ctx, this.x, this.y, e.offsetX, e.offsetY)
        this.x = 0
        this.y = 0
        this.isDrawing = false
      }
    })
  }

  drawLine(context, x1, y1, x2, y2) {
    context.beginPath()
    var gradient = context.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    gradient.addColorStop('0', 'magenta')
    gradient.addColorStop('0.5', 'blue')
    gradient.addColorStop('1.0', 'red')
    context.strokeStyle = gradient

    context.lineWidth = 50
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
  }

  //   handleCanvas() {

  //     this.ctx.fillStyle = "#FF0000"
  //     this.ctx.fillRect(ctx.height, ctx.width, 10, 10)
  //   }

  async handleClick(event) {
    event.preventDefault()

    await axios.get(`/api/sounds`)
  }

  async handleOff(event) {
    event.preventDefault()
    await axios.delete(`/api/sounds`)
  }

  render() {
    return (
      <div>
        HELLO
        <div>
          <button onClick={this.handleClick}>Start Audio</button>
          <button onClick={this.handleOff}>Stop Audio</button>
        </div>
        <div>
          <canvas
            id="my-canvas"
            width={window.innerWidth}
            height={window.innerHeight}
            onClick={this.handleCanvas}
          >
            <p>Your browser doesnt support canvas</p>
          </canvas>
        </div>
      </div>
    )
  }
}
