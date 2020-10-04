import React from 'react'
import axios from 'axios'
import LoadingSpinner from './loadingSpinner'

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
    this.imgDataLoop = this.imgDataLoop.bind(this)
    this.state = {
      loading: false
    }
    this.drawLine = this.drawLine.bind(this)
    this.handleThird = this.handleThird.bind(this)
    this.level = 0
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
      try {
        if (this.isDrawing === true) {
          this.drawLine(this.ctx, this.x, this.y, e.offsetX, e.offsetY)
          this.x = 0
          this.y = 0
          this.isDrawing = false
        }

        const imgData = this.ctx.getImageData(
          this.x,
          this.y,
          this.canvas.width,
          this.canvas.height
        ).data
        const pixels = []

        
        ;``

        const pixelsFilled = this.imgDataLoop(imgData, pixels)

        const percentCompleted =
          pixelsFilled / (this.canvas.width * this.canvas.height)
        let howManyTimes = 0
        if (percentCompleted > 2.9) {
          howManyTimes++

          if (howManyTimes === 1) {
            const res = await axios.delete(`/api/sounds`)
            const doneStatus = await res.data
            console.log(doneStatus, 'DONT STATSU')
            await this.level++
            await this.ctx.clearRect(
              0,
              0,
              this.canvas.width,
              this.canvas.height
            )
            if(this.level === 3) {
              alert('you won the whole game')
            } else {if (doneStatus === 'done') {
             
              this.setState({
                loading: true
              })
              // console.log('statate:', this.loading)
              const level = {
                level: this.level
              }

              setTimeout(async () => {
                await axios.put(`/api/sounds`, level)
                // this.loading = false
                await this.setState({
                  loading: false
                })
                console.log(this.loading)
              }, 4000)}
            
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    })
  }
  imgDataLoop(imgData, pixels) {
    if (typeof imgData !== 'array') {
      for (let i = 0; i < imgData.length; i++) {
        if (imgData[i] !== 0) {
          pixels.push(imgData[i])
        }
      }
    } else {
      for (let j = 0; j < imgData.length; j++) {
        imgDataLoop(imgData[j])
      }
    }

    return pixels.length
  }
  drawLine(context, x1, y1, x2, y2) {
    let gradient
    context.beginPath()
    if (this.level === 0) {
      gradient = context.createLinearGradient(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )

      gradient.addColorStop('0', 'magenta')
      gradient.addColorStop('0.5', 'blue')
      gradient.addColorStop('1.0', 'red')
    }

    if (this.level === 1) {
      gradient = context.createLinearGradient(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )
      gradient.addColorStop('0', 'lime')
      gradient.addColorStop('0.5', 'purple')
      gradient.addColorStop('1.0', 'black')
    }

    if (this.level === 2) {
      gradient = context.createLinearGradient(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )
      gradient.addColorStop('0', 'DarkOrchid')
      gradient.addColorStop('0.5', 'LavenderBlush')
      gradient.addColorStop('1.0', 'MediumTurquoise')
    }
    context.strokeStyle = gradient

    context.lineWidth = 50
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
  }

  async handleClick(event) {
    event.preventDefault()
    const infoObject = {
      data: this.level
    }
    await axios.get(`/api/sounds`)
  }

  async handleOff(event) {
    event.preventDefault()
    await axios.delete(`/api/sounds`)
  }

  async handleThird() {
    await axios.put(`/api/sounds`)
  }

  render() {
    const loading = this.state.loading
    console.log(loading)
    return (
      <div>
        <div>
          <button className='button' onClick={this.handleClick}>Start Audio</button>
          <button className='button' onClick={this.handleOff}>Stop Audio </button>
          
          {this.state.loading ? <LoadingSpinner /> : null}
        </div>
        <div>
          <canvas
            id="my-canvas"
            width={window.innerWidth}
            height={window.innerHeight}
          >
            <p>Your browser doesnt support canvas</p>
          </canvas>
        </div>
      </div>
    )
  }
}
