import React, { Component } from 'react';

// Datumsanzeige

class Tagesanzeige extends Component {
  
  render() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const today  = new Date();
    const dateString = today.toLocaleDateString("de-DE", options);
    return (
        <span>{dateString}</span>
    );
  }
}

export default Tagesanzeige;