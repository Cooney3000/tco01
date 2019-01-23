import React, { Component } from 'react';
import Platzbelegung from "./Platzbelegung";

// Alle Belegungen an diesem Tag für einen Platz

class Platz extends Component {
  
  render() {
    return (
        <div>
            <div className="ts T-08-00 D-60  ">T-08-00 D-60 <Platzbelegung /></div>
            <div className="ts T-09-30 D-60  ">T-09-30 D-60 <Platzbelegung /></div>
            <div className="ts T-11-00 D-120 ">T-11-00 D-120 <Platzbelegung /></div>
            <div className="ts T-15-00 D-60  ">T-15-00 D-60 <Platzbelegung /></div>
            <div className="ts T-16-00 D-60  ">T-16-00 D-60 <Platzbelegung /></div>
            <div className="ts T-17-15 D-90  ">T-17-15 D-90 <Platzbelegung /></div>
            <div className="ts T-19-00 D-30  ">T-19-00 D-30 <Platzbelegung /></div>
        </div>
    );
  }
}

export default Platz;