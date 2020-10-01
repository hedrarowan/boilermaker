import React from 'react'
import axios from 'axios'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick(event) {
    event.preventDefault()
    console.log('HELLO GEORGE')
    await axios.get(`/api/users`)
  }

  render() {
    return (
      <div>
        HELLO
        <button onClick={this.handleClick}>Press Me</button>
      </div>
    )
  }
}
