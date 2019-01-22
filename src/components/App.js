import React, { Component } from 'react';
import Tagesanzeige from "./Tagesanzeige";
import Belegungstag from "./Belegungstag";

class App extends Component {
  render() {

    return (
        <div>
          <Tagesanzeige />
          <Belegungstag />
        </div>
    );
  }
}

export default App;