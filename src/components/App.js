import React, { Component } from 'react';
import Routing from "./Routing";

class App extends Component {
  
  render() {
    return (
      <React.Fragment>
        <div className="p-1">
            <span className="logo"><img src="/images/tcoplain_0,1x.png" alt="TCO -Logo" /></span> 
            <span className="w-75 text-center h3 align-middle ml-2">Platzbelegung</span>
        </div>
        <Routing />
      </React.Fragment>
    )};
  }


export default App;
  