import React, { Component } from 'react';
import Tagesanzeige from "./Tagesanzeige";
import Belegungstag from "./Belegungstag";

class App extends Component {
  render() {

    return (
        <React.Fragment>
          <h1><Tagesanzeige /></h1>
          <Belegungstag />
        </React.Fragment>
    );
  }
}

export default App;