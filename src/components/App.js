import React, { Component } from 'react';
import Routing from "./Routing";

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <div className="p-1">
            <span className="logo"><img src="images/TCO-Logo_150x60.png" alt="TCO -Logo" /></span>
            <span className="w-75 text-center h3">TCO&nbsp;Magnettafel { new Date().toLocaleDateString("de-DE",{ weekday: 'short', month: 'short', day: 'numeric' }) }</span>
            <span id="topButton"></span>
        </div>
        <Routing />
      </React.Fragment>
  )};
}

export default App;
  