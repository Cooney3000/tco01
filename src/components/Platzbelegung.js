import React, { Component } from 'react';

// Dauer und Spieler

class Platzbelegung extends Component {
      
  render() {
    return (
        <div>
            <div className="ts T-08-00 D-60 " onClick={this.bearbeiteBelegung('1')}>T-08-00 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-19-00 D-30 " onClick={this.bearbeiteBelegung('2')}>T-19-00 D-30  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-09-30 D-60 " onClick={this.bearbeiteBelegung('3')}>T-09-30 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-11-00 D-120" onClick={this.bearbeiteBelegung('4')}>T-11-00 D-120 <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-15-00 D-60 " onClick={this.bearbeiteBelegung('5')}>T-15-00 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-16-00 D-60 " onClick={this.bearbeiteBelegung('6')}>T-16-00 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-17-15 D-90 " onClick={this.bearbeiteBelegung('7')}>T-17-15 D-90  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
        </div>
    );
  }
}

export default Platzbelegung;