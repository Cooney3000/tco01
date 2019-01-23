import React, { Component } from 'react';

class Zeitleiste extends Component {
  
  // Vertikale Zeitleiste von 08:00 h bis 21:00 h

  render() {
    let zeit = [];
    for (let s = 8; s < 21; s++) {
      for (let m = 0; m < 60; m=m+15) {
        zeit.push (s.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0'));
      }
    } 
    return (
        <div>
          {
            zeit.map((e, index) => <div className="viertelstunde" key={index}>{e}</div>)
          }
        </div>
    );
  }
}

export default Zeitleiste;