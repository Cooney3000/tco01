import React, { Component } from 'react';
import Tagesanzeige from "./Tagesanzeige";
import Routing from "./Routing";

class App extends Component {
    
    render() {
    // const { bookingData } = this.state;  
    return (
      <React.Fragment>
        <h1>
            <img src="/images/TCO-Logo_2010.png" alt="TCO -Logo" id="logotcoheader" /> TCO Magnettafel - 
            <Tagesanzeige />
        </h1>
        <Routing />
      </React.Fragment>
    )};
  }


export default App;
  