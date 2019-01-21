import React, { Component } from 'react';

class Tagesanzeige extends Component {
  
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  today  = new Date();
  dateString = today.toLocaleDateString("de-DE", options);

  render() {
    <div>{dateString}</div>
  }
}

export default Tagesanzeige;