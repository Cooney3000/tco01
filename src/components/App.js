import React, { Component } from 'react';
import Tagesanzeige from "./Tagesanzeige";
import Belegungstag from "./Belegungstag";

class App extends Component {
    
    render() {
    // const { bookingData } = this.state;  
    return (
      <React.Fragment>
          <h1><Tagesanzeige /></h1>
          {/* <Belegungstag bookingData={bookingData} /> */}
          <Belegungstag />
        </React.Fragment>
    )};
  }


export default App;
  