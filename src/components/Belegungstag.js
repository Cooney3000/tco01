import React, { Component } from 'react';
import Platz from "./Platz";
import Zeitleiste from "./Zeitleiste";

class Belegungstag extends Component {
  
  render() {
    return (
        <div>
          <table className="table">
          <thead>
            <tr>
              <th>Uhr</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Zeitleiste /></th>
              <td><Platz /></td>
              <td><Platz /></td>              
              <td><Platz /></td>
              <td><Platz /></td>
              <td><Platz /></td>
              <td><Platz /></td>
            </tr>
          </tbody>
          </table>
        </div>
    );
  }
}

export default Belegungstag;








