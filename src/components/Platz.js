import React, { Component } from 'react';

// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
  render() {
    const { onClickHandler } = this.props;
    return (
        <div>
            <div className="ts T-08-00 D-60 " onClick={onClickHandler}>T-08-00 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-19-00 D-30 " onClick={onClickHandler}>T-19-00 D-30  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-09-30 D-60 " onClick={onClickHandler}>T-09-30 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-11-00 D-120" onClick={onClickHandler}>T-11-00 D-120 <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-15-00 D-60 " onClick={onClickHandler}>T-15-00 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-16-00 D-60 " onClick={onClickHandler}>T-16-00 D-60  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
            <div className="ts T-17-15 D-90 " onClick={onClickHandler}>T-17-15 D-90  <span>Spieler 1 </span><span>Spieler 2 </span><span>Spieler 3 </span><span>Spieler 4 </span></div>
        </div>
    );
  }
}

export default Platz;