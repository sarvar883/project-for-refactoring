import React, { Component } from 'react';
import Calendar from 'react-calendar';

class Landing extends Component {
  state = {
    date: new Date(),
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <div>
        <h2>Приложение для Pro-Team</h2>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
        <p>{this.state.date.toString()}</p>
      </div>
    );
  }
}

export default Landing;