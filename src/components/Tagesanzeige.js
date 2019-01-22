import React, { Component } from 'react';

class Tagesanzeige extends Component {
  
  render() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const today  = new Date();
    const dateString = today.toLocaleDateString("de-DE", options);
    return (
        <div>{dateString}</div>
    );
  }
}

export default Tagesanzeige;